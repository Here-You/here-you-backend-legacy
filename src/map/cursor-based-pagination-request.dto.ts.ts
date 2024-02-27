// PaginationDto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CursorBasedPaginationRequestDto {
  @ApiProperty({
    description: '커서 값',
    required: false,
    default: 3,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  cursor?: number = 0;

  @ApiProperty({
    description: '페이지 크기',
    required: false,
    default: 3,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  pageSize?: number = 3;
}
