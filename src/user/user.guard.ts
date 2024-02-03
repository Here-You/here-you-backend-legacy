import Express from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import jsonwebtoken from 'jsonwebtoken';
import { IReqUser } from './user.dto';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Express.Request>();
    const authorization = request.headers['authorization']?.split(' ');

    if (authorization.length === 2 && authorization[0] === 'Bearer') {
      const token = authorization[1];

      try {
        request.user = jsonwebtoken.verify(
          token,
          process.env.JWT_SECRET,
        ) as IReqUser;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
}
