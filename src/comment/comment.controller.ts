import {Controller, Post, Body, Req, UseGuards, Param, Patch, Delete} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import {UserEntity} from "../user/user.entity";
import {RuleMainEntity} from "../rule/domain/rule.main.entity";

@Controller('mate/rule/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  // [1] 댓글 작성
  @Post('/:ruleId')
  @UseGuards(UserGuard)
  async createComment(@Body() dto: CreateCommentDto, @Param('ruleId') ruleId: number, @Req() req: Request): Promise<ResponseDto<any>> {
    const result = await this.commentService.createComment(dto, ruleId, req.user.id);

    console.log('controller 진입')
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

  // [2] 댓글 수정
  @Patch('/:ruleId/:commentId')
  @UseGuards(UserGuard)
  async updateComment(@Body() dto: CreateCommentDto, @Param('ruleId') ruleId: number, @Param('commentId') commentId: number,@Req() req: Request): Promise<ResponseDto<any>> {
    try {
      const result = await this.commentService.updateComment(dto, ruleId, req.user.id, commentId);
      return new ResponseDto(
          ResponseCode.COMMENT_UPDATE_SUCCESS,
          true,
          "여행 규칙 코멘트 수정 성공",
          result);
    } catch (e) {
      return new ResponseDto(
          ResponseCode.COMMENT_UPDATE_FAIL,
          false,
          e.message,
          null);
    }
  }

  // [3] 댓글 삭제
  @Delete('/:ruleId/:commentId')
  @UseGuards(UserGuard)
  async deleteComment(@Param('ruleId') ruleId: number, @Param('commentId') commentId: number,@Req() req: Request): Promise<ResponseDto<any>> {
    try {
      const result = await this.commentService.deleteComment(ruleId, req.user.id, commentId);
      return new ResponseDto(
          ResponseCode.COMMENT_DELETE_SUCCESS,
          true,
          "여행 규칙 코멘트 삭제 성공",
          result);
    } catch (e) {
      return new ResponseDto(
          ResponseCode.COMMENT_DELETE_FAIL,
          false,
          e.message,
          null);
    }
  }
}