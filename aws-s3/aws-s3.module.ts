import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'S3_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('S3_ACCESS_KEY')!,
            secretAccessKey: configService.get('S3_SECRET_KEY')!,
          },
        });
      },
    },
    AwsS3Service,
  ],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
