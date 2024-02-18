// S3.controller.ts

import { Body, Controller, Get } from '@nestjs/common';
import { S3UtilService } from './S3.service';

@Controller('image')
export class S3UtilController {
  constructor(private readonly s3Service: S3UtilService) {}

  @Get('/signature')
  GetPresignedUrlForSignature() {
    // 시그니처 이미지 업로드 요청시
    return this.s3Service.GetPresignedUrlForSignature();
  }

  @Get('/test')
  TestImageUrlWithKey(
    //presigned URL 잘 보내졌나 테스트용
    @Body('key') key: string,
  ) {
    return this.s3Service.TestImageUrlWithKey(key);
  }
}
