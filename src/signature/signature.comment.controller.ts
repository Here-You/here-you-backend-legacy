// signature.comment.controller.ts

import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SignatureCommentService } from './signature.comment.service';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';
import { CursorPageOptionsDto } from '../rule/dto/cursor-page.options.dto';

@Controller('signature/:signatureId')
export class SignatureCommentController{
  constructor(private readonly signatureCommentService: SignatureCommentService) {}

  @Post('/comment')
  @UseGuards(UserGuard)
  async createSignatureComment( // 시그니처 댓글 생성하기
    @Req() req: Request,
    @Param('signatureId') signatureId: number,
    @Body() newComment: CreateCommentDto,
  ){
    try{
      const result = await this.signatureCommentService.createSignatureComment(newComment, req.user.id, signatureId)

      return new ResponseDto(
        ResponseCode.CREATE_SIGNATURE_COMMENT_SUCCESS,
        true,
        "시그니처 댓글 생성 성공",
        result
      );

    }
    catch(error){
      console.log('Error on createSigComment: ',error);
      return new ResponseDto(
        ResponseCode.COMMENT_CREATION_FAIL,
        false,
        "시그니처 댓글 생성 실패",
        null
      );
    }
  }

  @Post('/comment/:commentId')
  @UseGuards(UserGuard)
  async createSignatureReplyComment(  // 시그니처 답글 생성하기
    @Req() req: Request,
    @Param('signatureId') signatureId: number,
    @Param('commentId') commentId: number,
    @Body() newComment: CreateCommentDto,
  ){
    try{
      const result = await this.signatureCommentService.createSignatureComment(newComment, req.user.id, signatureId, commentId)

      return new ResponseDto(
        ResponseCode.CREATE_SIGNATURE_COMMENT_SUCCESS,
        true,
        "시그니처 답글 생성 성공",
        result
      );

    }
    catch(error){
      console.log('Error on createSigComment: ',error);
      return new ResponseDto(
        ResponseCode.COMMENT_CREATION_FAIL,
        false,
        "시그니처 답글 생성 실패",
        null
      );
    }
  }

  @Get('/comment')
  @UseGuards(UserGuard)
  async getSignatureComment(  // 시그니처 댓글 조회하기 (무한 스크롤)
    @Req() req: Request,
    @Param('signatureId') signatureId: number,
    @Query() cursorPageOptionsDto: CursorPageOptionsDto,
  ){
    try{
      const result = await this.signatureCommentService.getSignatureComment(cursorPageOptionsDto, req.user.id, signatureId);

      return new ResponseDto(
        ResponseCode.GET_COMMENT_DETAIL_SUCCESS,
        true,
        "시그니처 댓글 가져오기 성공",
        result
      );
    }
    catch(error){
      console.log('Error on createSigChildComment: ',error);
      return new ResponseDto(
        ResponseCode.GET_COMMENT_DETAIL_FAIL,
        false,
        "시그니처 댓글 가져오기 실패",
        null
      );
    }
  }





}