//signature.module.ts

import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { SignatureEntity } from './domain/signature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';

@Module({
  controllers: [SignatureController],
  providers: [SignatureService],
})
export class SignatureModule {}
