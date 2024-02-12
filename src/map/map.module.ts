// Map.module.ts
import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { S3Module } from 'src/utils/S3.module';

@Module({
  imports: [S3Module],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
