import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { S3Module } from '../utils/S3.module';

@Module({
  imports: [S3Module],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
