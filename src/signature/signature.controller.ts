// signature.controller.ts

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { DetailSignatureDto } from './dto/detail-signature.dto';
import { TmpUserIdDto } from './dto/tmp-userId.dto';


@Controller('signature')
//@UseGuards(new AuthGuard())
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('/') // 시그니처 탭 메인: 내 시그니처 목록
  async getMySignature(@Body() user_id: TmpUserIdDto): Promise<ResponseDto<HomeSignatureDto[]>> {

    // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정
    const result = await this.signatureService.homeSignature(user_id.userId);

    if(!result){
      return new ResponseDto(
        ResponseCode.GET_MY_SIGNATURE_FAIL,
        false,
        "내 시그니처 가져오기 실패",
        null
      );
    }
    else{
      return new ResponseDto(
        ResponseCode.GET_MY_SIGNATURES_SUCCESS,
        true,
        "내 시그니처 가져오기 성공",
        result
      );
    }
  }

  @Post('/new')
  async createNewSignature( // 시그니처 생성하기
    @Body() newSignature: CreateSignatureDto,
  ): Promise<ResponseDto<any>> {
    const result = await this.signatureService.createSignature(newSignature);

    if(!result){
      return new ResponseDto(
        ResponseCode.SIGNATURE_CREATION_FAIL,
        false,
        "시그니처 생성에 실패했습니다",
        null);

    }
    else{
      return new ResponseDto(
        ResponseCode.SIGNATURE_CREATED,
        true,
        "시그니처 기록하기 성공",
        result);
    }
  }

  @Get('/:signatureId') // 시그니처 상세보기
  async getSignatureDetail(
    @Body() user_id: TmpUserIdDto,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<DetailSignatureDto>> {

    // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정
    const result = await this.signatureService.detailSignature(user_id.userId, signatureId);

    return new ResponseDto(
      ResponseCode.GET_SIGNATURE_DETAIL_SUCCESS,
      true,
      "시그니처 상세보기 성공",
      result
    );
  }

}
