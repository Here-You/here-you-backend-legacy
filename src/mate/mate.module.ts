import { Module } from '@nestjs/common';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { UserService } from '../user/user.service';
import { S3UtilService } from '../utils/S3.service';
import { SignatureService } from '../signature/signature.service';

@Module({
  controllers: [MateController],
  providers: [MateService, UserService, S3UtilService, SignatureService],
})
export class MateModule {}
