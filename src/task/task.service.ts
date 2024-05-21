import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class TaskService {
 
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handlePendingPayment() {
    Logger.log('handle PendingPayment Task start');

  }


}
