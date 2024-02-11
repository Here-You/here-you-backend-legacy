import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { S3UtilService } from '../utils/S3.service';

@Module({
  controllers: [UserController],
  providers: [UserService, S3UtilService],
})
export class UserModule {}
