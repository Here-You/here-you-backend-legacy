import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CommentPairDto } from './comment-pair.dto';

export class DetailCommentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentPairDto)
  commentPairs: CommentPairDto[];
}

