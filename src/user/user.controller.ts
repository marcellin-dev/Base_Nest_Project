import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  OnApplicationBootstrap,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { getCurrentUser } from '../common/decorator';

import { UserRole } from '../common/role.enum';
import { ICurrentUser } from '../common/data.type';

@ApiTags('user')
@ApiBearerAuth('bearer')
@Controller('user')
export class UserController implements OnApplicationBootstrap {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @UsePipes(new FormdataValidation(createUserSchema))
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }
  onApplicationBootstrap(): any {
    this.userService.initRoleAndAdminUser();
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async findInfoUser(@getCurrentUser() user: ICurrentUser) {
    Logger.log('user ==============> ', user);
    return await this.userService.findOne(user.id);
  }

  @SetMetadata('roles', [UserRole.USER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(String(id));
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
