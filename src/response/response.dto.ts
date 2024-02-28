import { ApiProperty } from '@nestjs/swagger';
import { ResponseCode } from './response-code.enum';

export class ResponseDto<T> {
  @ApiProperty({ description: '응답 시간' })
  timestamp: Date = new Date();

  @ApiProperty({ description: 'http status code' })
  code: ResponseCode;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: '데이터 불러오기 성공', description: '응답 메시지' })
  message: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Response Body',
  })
  data?: T;

  public constructor(
    code: ResponseCode,
    success: boolean,
    message: string,
    data: T,
  ) {
    this.code = code;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
