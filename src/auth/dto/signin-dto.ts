import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @ApiProperty({
    default: 'lelemarcellin@gmail.com',
    description: 'email of the user',
  })
  email: string;
  @IsString()
  @ApiProperty({ default: '123', description: 'password of the user' })
  password: string;
}

export class VerifyEmailDto {
  @IsEmail()
  @ApiProperty({ default: 'lele@gmail.com', description: 'email of the user' })
  email: string;

  @Length(6, 6)
  @ApiProperty({ default: '000000', description: 'Otp code' })
  otp: string;
}

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ default: 'lele@gmail.com', description: 'email of the user' })
  email: string;
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  isSeller: string;
}
