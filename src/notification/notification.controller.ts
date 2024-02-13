import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { UserGuard } from '../user/user.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(UserGuard)
  ListNotification(@Req() req: Request) {
    return this.notificationService.listNotifications(req.user.id);
  }
}
