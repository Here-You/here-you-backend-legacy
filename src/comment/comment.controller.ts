import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';

@Controller('mate/rule')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  // 여행 규칙 코멘트 생성
  @Post('/:ruleId')
  @UseGuards(UserGuard)
  async createComment(@Body() createCommentDto: CreateCommentDto, @Param('ruleId') ruleId: number, @Req() req: Request): Promise<ResponseDto<any>> {
    const result = await this.commentService.createComment(createCommentDto, ruleId, req.user.id);

    if(!result){
      return new ResponseDto(
        ResponseCode.COMMENT_CREATION_FAIL,
        false,
        "여행 규칙 코멘트 생성 실패",
        null);

    }
    else{
      return new ResponseDto(
        ResponseCode.COMMENT_CREATED,
        true,
        "여행 규칙 코멘트 생성 성공",
        result);
    }
  }
}