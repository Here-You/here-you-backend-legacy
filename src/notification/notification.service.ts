import { Injectable, Logger } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async listNotifications(userId: number) {
    try {
      const notifications = await NotificationEntity.find({
        where: {
          notificationReceiver: {
            id: userId,
          },
        },
        relations: {
          notificationSender: true,
        },
        order: {
          created: 'DESC',
        },
        take: 100,
      });

      await NotificationEntity.update(
        {
          notificationReceiver: {
            id: userId,
          },
          notificationRead: false,
        },
        {
          notificationRead: true,
        },
      );

      return new ResponseDto(
        ResponseCode.GET_NOTIFICATION_SUCCESS,
        true,
        '알림 조회 성공',
        notifications.map((notification) => ({
          id: notification.id,
          content: {
            actionUserNickname: notification.notificationSender.nickname,
            type: notification.notificationTargetType,
            action: notification.notificationAction,
          },
          itemId: notification.notificationTargetId,
          itemDesc: notification.notificationTargetDesc,
          isRead: notification.notificationRead,
          created: notification.created,
        })),
      );
    } catch (e) {
      this.logger.error(e);
      return new ResponseDto(
        ResponseCode.INTERNAL_SERVEr_ERROR,
        false,
        '서버 내부 오류',
        null,
      );
    }
  }

  async countUnreadNotification(userId: number) {
    const unreadCount = await NotificationEntity.count({
      where: {
        notificationReceiver: {
          id: userId,
        },
        notificationRead: false,
      },
    });

    return new ResponseDto(
      ResponseCode.GET_NOTIFICATION_COUNT_SUCCESS,
      true,
      '읽지 않은 알림 개수 조회 성공',
      {
        unreadCount,
      },
    );
  }
}
