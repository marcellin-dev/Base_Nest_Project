import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto, VerifyEmailDto } from './dto/signin-dto';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '../common/decorator';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @AllowAnonymous()
  @Post('login')
  signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @AllowAnonymous()
  @Post('signup')
  // @UsePipes(new FormdataValidation(createUserSchema))
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @AllowAnonymous()
  @Post('verify-email')
  verifyEmail(@Body() VerifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(VerifyEmailDto);
  }
}
