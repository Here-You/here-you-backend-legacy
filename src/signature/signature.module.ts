//signature.module.ts

import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { SignatureEntity } from './domain/signature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { UserService } from '../user/user.service';
import { S3UtilService } from '../utils/S3.service';

@Module({
  controllers: [SignatureController],
  providers: [SignatureService,UserService, S3UtilService],
})
export class SignatureModule {}
