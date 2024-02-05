import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowListConverter } from './follow.list.converter';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, FollowListConverter, UserService],
})
export class FollowModule {}
