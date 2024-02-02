import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetDiaryImgUrlDto } from 'src/diary/dtos/get-diary-img-url.dto';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject('S3_CLIENT')
    private readonly s3Client: S3Client,

    private readonly configService: ConfigService,
  ) {}
  async getDiaryImgUrl(diaryId: number, getDiaryImgUrlDto: GetDiaryImgUrlDto) {
    // 저장될 파일 이름
    const fileName = `profile/${diaryId}/${Date.now()}${
      getDiaryImgUrlDto.fileName
    }`;

    // Put. 즉, s3에 데이터를 집어넣는 작업에 대한 url 생성
    const command = new PutObjectCommand({
      Bucket: this.configService.get('S3_BUCKET'),
      Key: fileName,
    });

    const postedImgUrl = await getSignedUrl(this.s3Client, command);
    return postedImgUrl;
  }
}
