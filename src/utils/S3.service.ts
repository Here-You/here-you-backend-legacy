import * as S3 from 'aws-sdk/clients/s3.js';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3UtilService {
  private readonly s3 = new S3({
    endpoint: process.env.S3_ENDPOINT ?? undefined,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
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
    return this.s3.getSignedUrlPromise('getObject', {
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
    const uuid = uuidv4();

    return `${uuid}.${ext}`;
  }
}
