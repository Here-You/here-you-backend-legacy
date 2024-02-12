// signature.comment.controller.ts

import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SignatureCommentService } from './signature.comment.service';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('signature/:signatureId')
export class SignatureCommentController{
  constructor(private readonly signatureCommentService: SignatureCommentService) {}

  @Post('/comment')
  @UseGuards(UserGuard)
  async createSignatureComment(
    @Req() req: Request,
    @Param('signatureId') signatureId: number,
    @Body() newComment: CreateCommentDto,
  ){
    try{
      const result = await this.signatureCommentService.createSignatureComment(newComment, req.user.id, signatureId)

    }
    catch(error){
      console.log('Error on createSigComment: ',error);

    }
  }

  @Post('/comment/:commentId')
  @UseGuards(UserGuard)
  async createSignatureReplyComment(
    @Req() req: Request,
    @Param('signatureId') signatureId: number,
    @Param('commentId') commentId: number,
    @Body() newComment: CreateCommentDto,
  ){
    try{

    }
    catch(error){
      console.log('Error on createSigChildComment: ',error);

    }
  }



}