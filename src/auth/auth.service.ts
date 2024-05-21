import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { generateOtp, sendEmail } from '../common/helpers/utils';
import { CreateUserDto, VerifyEmailDto } from './dto/signin-dto';
import { catchError, from, switchMap } from 'rxjs';
import { UserRole } from 'src/common/role.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        role: {
          select: { name: true },
        },
      },
    });

    if (!user)
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'user not found',
      });

    const isMatch = await argon2.verify(user.password, pass);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    const payload = { userId: user.id };
    return {
      ...result,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const hash = await argon2.hash(createUserDto.password);
    try {
      const role = await this.prisma.role.findFirst({
        where: {
          name:
            createUserDto.isSeller === 'true' ? UserRole.SELLER : UserRole.USER,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isSeller, ...rest } = createUserDto;
      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hash,
          roleId: role.id,
          profileComplete: isSeller === 'true' ? false : true,
        },
      });
      const otp = generateOtp();

      await this.prisma.otp.create({
        data: { otp: String(otp), email: user.email },
      });

      const message = `Votre code de vérification SSWAP est ${otp}`;

      sendEmail(createUserDto.email, message, 'Code de vérification');

      // const { password, ...rest } = user;
      delete user.password;
      return user;
    } catch (error) {
      console.log('err ==> ', error);
      if (error.code === 'P2002') {
        throw new ConflictException({
          code: 'CONFLICT',
          message: 'user already exist ',
        });
      } else throw new Error(error);
    }
  }

  verifyEmail(VerifyEmailDto: VerifyEmailDto) {
    return from(
      this.prisma.otp.findFirstOrThrow({
        where: { email: VerifyEmailDto.email, otp: VerifyEmailDto.otp },
      }),
    ).pipe(
      switchMap((otp) => {
        return from(this.prisma.otp.delete({ where: { id: otp.id } })).pipe(
          switchMap(() => {
            const diff = new Date().getTime() - otp.createdAt.getTime();
            if (diff > 5 * 60 * 1000) {
              throw new UnauthorizedException({
                code: 'UNAUTHORIZED',
                message: 'code expired',
              });
            }

            return from(
              this.prisma.user.update({
                where: { email: otp.email },
                data: { emailVerified: true },
                select: { email: true },
              }),
            );
          }),
        );
      }),
      catchError((err) => {
        if (err.code === 'P2025') {
          throw new NotFoundException({
            code: 'NOT_FOUND',
            message: 'code not found',
          });
        }
        console.log('err ==> ', err);
        if (err.status === 401)
          throw new UnauthorizedException({
            code: 'UNAUTHORIZED',
            message: 'code expired',
          });
        throw new Error(err);
      }),
    );
  }
}
