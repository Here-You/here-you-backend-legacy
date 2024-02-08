import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDiaryImgUrlDto {
  @ApiProperty({
    example: 'abc.png',
    description: '파일명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
