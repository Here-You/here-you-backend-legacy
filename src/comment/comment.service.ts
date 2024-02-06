import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentConverter } from './comment.converter';
import { CommentEntity } from './domain/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private commentConverter: CommentConverter
  ) {}

  async createComment(createCommentDto: CreateCommentDto, ruleId: number): Promise<number> {
    const comment = await this.commentConverter.toEntity(createCommentDto, ruleId);

    const savedComment = await CommentEntity.save(comment);

    return savedComment.id;
  }
}