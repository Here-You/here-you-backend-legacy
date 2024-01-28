//signature.module.ts

import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { SignatureEntityRepository } from './signature.repository';
import SignatureEntity from './signature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';

@Module({
  //imports: [TypeOrmModule.forFeature([SignatureEntity])],
  controllers: [SignatureController],
  providers: [SignatureService, SignatureEntityRepository, EntityManager],
})
export class SignatureModule {}
