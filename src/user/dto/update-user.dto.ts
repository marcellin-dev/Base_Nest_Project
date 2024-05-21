import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../../auth/dto/signin-dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
