import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentConverter } from './comment.converter';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentConverter],
})
export class CommentModule {}
