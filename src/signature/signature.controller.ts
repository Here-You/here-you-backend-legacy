// signature.controller.ts

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { HomeSignatureDto } from './dto/home-signature.dto';

@Controller('signature')
//@UseGuards(new AuthGuard())
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  /*
  @Get('/')
  getMySignature(@Body() userId: number) {
    // 임시로 토큰이 아닌 유저 아이디 받도록 구현
    console.log('signature/: 내 시그니처 요청');
    return this.signatureService.homeSignature(userId);
  }
  */

  @Post('/new')
  async createNewSignature(
    @Body() newSignature: CreateSignatureDto,
  ): Promise<any> {
    const result = await this.signatureService.createSignature(newSignature);

    if(!result){
      return {
        status: 500,
        success: false,
        message: "서버 내부 오류",
      };

    }
    else{
      return {
        status: 201,
        success: true,
        message: "시그니처 기록하기 성공",
        data: {result}
      };
    }
  }
}
