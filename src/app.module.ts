// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';
import { LocationModule } from './location/location.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PlaceModule } from './place/place.module';
import { JourneyModule } from './journey/journey.module';
import { SignatureModule } from './signature/signature.module';
import { RuleModule } from './rule/rule.module';
import { CommentModule } from './comment/comment.module';
import { DetailScheduleModule } from './detail-schedule/detail-schedule.module';
import { S3Module } from './utils/S3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    DiaryModule,
    LocationModule,
    ScheduleModule,
    DetailScheduleModule,
    PlaceModule,
    JourneyModule,
    SignatureModule,
    RuleModule,
    CommentModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
