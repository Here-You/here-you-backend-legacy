import { HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { UserEntity } from './user.entity';
import { IReqUser } from './user.dto';
import { UserFollowingEntity } from './user.following.entity';

@Injectable()
export class UserService {
  private _hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private _comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private _generateToken(payload: IReqUser) {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }

  async Login(email: string, password: string) {
    const user = await UserEntity.findOne({
      where: {
        email: email.toString() ?? '',
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 403);
    }

    if (!this._comparePassword(password, user.password)) {
      throw new HttpException('Invalid credentials', 403);
    }

    return {
      success: true,
      token: this._generateToken({
        id: user.id,
      }),
    };
  }

  async FindUser(id: number) {
    const user: UserEntity = await UserEntity.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new HttpException('Invalid user', 403);
    }

    return user;
  }
}
