import Express from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import { IReqUser } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class OptionalUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Express.Request>();
    const authorization = request.headers['authorization']?.split(' ');

    if (
      authorization &&
      authorization.length === 2 &&
      authorization[0] === 'Bearer'
    ) {
      const token = authorization[1];

      try {
        request.user = jsonwebtoken.verify(
          token,
          process.env.JWT_SECRET,
        ) as IReqUser;

        // 사용자 검증
        const isValidUser = await UserEntity.findOne({
          where: {
            id: request.user.id,
            isQuit: false,
          },
        });

        if (!isValidUser) {
          return false;
        }
      } catch (error) {
        return false;
      }
    } else {
      // 토큰이 없는 경우
      request.user = null;
    }

    return true;
  }
}
