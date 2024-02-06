import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowListConverter } from './follow.list.converter';
import { FollowerListConverter } from './follower.list.converter';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, FollowListConverter, FollowerListConverter, UserService],
})
export class FollowModule {}
