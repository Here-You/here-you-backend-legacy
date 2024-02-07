import * as S3 from 'aws-sdk/clients/s3.js';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { S3PresignedUrlDto } from './S3.presignedUrl.dto';

@Injectable()
export class S3UtilService {
  private readonly s3 = new S3({
    signatureVersion: 'v4',
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  public async listObjects() {
    return this.s3
      .listObjectsV2({ Bucket: process.env.S3_BUCKET_NAME })
      .promise();
  }

  public async putObject(key: string, body: Buffer) {
    return this.s3
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: body,
      })
      .promise();
  }

  public async putObjectFromBase64(key: string, body: string) {
    return this.s3
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: Buffer.from(body, 'base64'),
      })
      .promise();
  }

  public async getPresignedUrl(key: string) {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 60,
    });
  }

  public async getImageUrl(key: string) {
    return `${process.env.S3_PUBLIC_URL}${key}`;
  }

  public generateRandomImageKey(originalName: string) {
    const ext = originalName.split('.').pop();
    console.log(ext);
    const uuid = uuidv4();

    return `${uuid}.${ext}`;
  }

  public async GetPresignedUrlForSignature(): Promise<S3PresignedUrlDto> {

    const s3PresignedUrlDto:S3PresignedUrlDto= new S3PresignedUrlDto();

    // 이미지 키 생성: 프론트에서는 업로드 후 백엔드에 키값을 보내줘야함
    s3PresignedUrlDto.key = `signature/${this.generateRandomImageKey('signature.png')}`;

    // 프론트에서 이미지를 업로드할 presignedUrl
    s3PresignedUrlDto.url = await this.getPresignedUrl(s3PresignedUrlDto.key);

    return s3PresignedUrlDto;
  }

  async TestImageUrlWithKey(key: string) {
    return await this.getImageUrl(key);
  }
}
