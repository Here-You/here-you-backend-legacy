import { Injectable, Logger } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  static createNotificationContent(type: 'LIKE' | 'COMMENT', nickname: string) {
    return `${nickname}님이 내 시그니처에 ${
      type === 'LIKE' ? '좋아요' : '댓글'
    }을 남겼습니다.`;
  }

  async listNotifications(userId: number) {
    try {
      const notifications = await NotificationEntity.find({
        where: {
          notificationReceiver: {
            id: userId,
          },
        },
        order: {
          created: 'DESC',
        },
        take: 100,
      });

      return new ResponseDto(
        ResponseCode.GET_NOTIFICATION_SUCCESS,
        true,
        '알림 조회 성공',
        notifications.map((notification) => ({
          id: notification.id,
          type: notification.notificationType,
          content: notification.notificationContent,
          itemId: notification.notificationItemId,
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
}
