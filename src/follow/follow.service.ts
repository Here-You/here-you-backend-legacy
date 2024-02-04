import { Injectable, HttpException } from '@nestjs/common';
import { UserFollowingEntity } from 'src/user/user.following.entity';

@Injectable()
export class FollowService {
  async createFollow(userId : number, followingId : number): Promise<UserFollowingEntity> {
    const follow = UserFollowingEntity.create({
        user: { id : userId },
        followUser: { id : followingId },
    });
    return follow.save();
  }
}
