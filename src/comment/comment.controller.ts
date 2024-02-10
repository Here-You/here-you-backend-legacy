import {Controller, Post, Body, Req, UseGuards, Param, Patch} from '@nestjs/common';
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

  // 여행 규칙 코멘트 수정
  /*
  @Patch('/:ruleId')
  @UseGuards(UserGuard)
  async updateComment(@Body() dto: CreateCommentDto, @Param('ruleId') ruleId: number, @Req() req: Request): Promise<ResponseDto<any>> {
    const result = await this.commentService.updateComment(dto, ruleId, req.user.id);

    if(!result){
      return new ResponseDto(
          ResponseCode.COMMENT_UPDATE_FAIL,
          false,
          "여행 규칙 코멘트 수정 실패",
          null);
    }
    else{
      return new ResponseDto(
          ResponseCode.COMMENT_UPDATE_SUCCESS,
          true,
          "여행 규칙 코멘트 수정 성공",
          result);
    }
  }
   */
}