import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetCommentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsDate()
  updated: Date;

  // 탈퇴한 회원이 작성한 댓글도 표시 -> null 허용
  @IsOptional()
  @IsNumber()
  writerId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}
