import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/strategies/jwt-auth.guard';
import { RolesGuard } from './common/guard/role.guard';

import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ScheduleModule.forRoot()],
  // controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    TaskService,
    // { provide: APP_GUARD, useClass: WsJwtGuard },
  ],
})
export class AppModule {}
