import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { UserService } from 'src/user/user.service';
import { S3UtilService } from '../utils/S3.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, UserService, S3UtilService],
})
export class FollowModule {}
