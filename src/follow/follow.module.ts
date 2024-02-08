import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, UserService],
})
export class FollowModule {}
