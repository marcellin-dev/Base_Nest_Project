import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../auth/dto/signin-dto';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const hash = await argon2.hash(createUserDto.password);
    // const ifExist = await this.prisma.user.findUnique({
    //   where: { email: createUserDto.email },
    // });
    //
    // if (ifExist)
    //   throw new ConflictException({
    //     code: 'CONFLICT',
    //     message: 'user already exist ',
    //   });

    try {
      const role = await this.prisma.role.findFirst({
        where: { name: 'USER' },
      });
      return await this.prisma.user.create({
        data: { ...createUserDto, password: hash, roleId: role.id },
      });
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
  findAll() {
    return `This action returns all user`;
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileComplete: true,
        emailVerified: true,
        phone: true,
        lock: true,
        firstname: true,
        lastname: true,
        rating: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // this.prisma.patient.update({
    //   where: { id: id },
    //   data: { ...updateUserDto },
    // });
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async initRoleAndAdminUser() {
    const roles = process.env.ROLES.split(',');
    for (const role of roles) {
      const checkRole = await this.prisma.role.findFirst({
        where: { name: role },
      });

      if (!checkRole) {
        await this.prisma.role.create({
          data: { name: role },
        });
      }
    }

    const checkAdmin = await this.prisma.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!checkAdmin) {
      const role = await this.prisma.role.findFirst({
        where: { name: 'ADMIN' },
      });

      const hash = await argon2.hash(process.env.ADMIN_PASSWORD);
      await this.prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: process.env.ADMIN_NAME,
          password: hash,
          emailVerified: true,
          profileComplete: true,
          roleId: role.id,
        },
      });
    }
  }
}
