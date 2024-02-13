// signature.comment.controller.ts

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignatureCommentService } from './signature.comment.service';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';
import { CursorPageOptionsDto } from '../rule/dto/cursor-page.options.dto';

@Controller('signature/:signatureId/comment')
export class SignatureCommentController{
  constructor(private readonly signatureCommentService: SignatureCommentService) {}

  @Post('/')
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

  @Post('/:parentId')
  @UseGuards(UserGuard)
  async createSignatureReplyComment(  // 시그니처 답글 생성하기
    @Req() req: Request,
    @Param('signatureId') signatureId: number,
    @Param('parentId') parentId: number,
    @Body() newComment: CreateCommentDto,
  ){
    try{
      const result = await this.signatureCommentService.createSignatureComment(newComment, req.user.id, signatureId, parentId)

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

  @Get('/')
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

  @Patch('/:commentId')
  @UseGuards(UserGuard)
  async patchSignatureComment(  // 시그니처 수정하기
    @Param('signatureId') signatureId: number,
    @Param('commentId') commentId: number,
    @Body() patchedComment: CreateCommentDto,
    @Req() req: Request,
  ){
    try{
      const result = await this.signatureCommentService.patchSignatureComment(req.user.id,signatureId,commentId,patchedComment);

      return new ResponseDto(
        ResponseCode.COMMENT_UPDATE_SUCCESS,
        true,
        "시그니처 댓글 수정하기 성공",
        result
      );
    }
    catch(error){
      console.log("Err on PatchSigComment: "+ error);
      let errorMessage = "";

      if(error instanceof NotFoundException)  errorMessage = error.message;
      else if(error instanceof ForbiddenException) errorMessage = error.message;
      else errorMessage = "시그니처 댓글 수정하기 실패";

      return new ResponseDto(
        ResponseCode.COMMENT_UPDATE_FAIL,
        false,
        errorMessage,
        null
      );

    }
  }
}