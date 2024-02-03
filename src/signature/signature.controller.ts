// signature.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { DetailSignatureDto } from './dto/detail-signature.dto';
import { TmpUserIdDto } from './dto/tmp-userId.dto';
import { SignatureEntity } from './domain/signature.entity';
import { SignatureLikeEntity } from './domain/signature.like.entity';
import { LikeSignatureDto } from './dto/Like-signature.dto';


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

  @Patch('/like/:signatureId') // 시그니처 좋아요 등록 or 취소
  async addSignatureLike(
    @Body() user_id: TmpUserIdDto,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<LikeSignatureDto>> {
    try{

      // [1] 이미 좋아요 했는지 확인
      const liked: SignatureLikeEntity= await this.signatureService.findIfAlreadyLiked(user_id.userId,signatureId);
      let result = new SignatureEntity();
      const likeSignatureDto= new LikeSignatureDto();

      if(liked){ // 이미 좋아요했던 시그니처라면 좋아요 삭제
        result = await this.signatureService.deleteLikeOnSignature(liked,signatureId);
        likeSignatureDto.liked = result.liked;
        likeSignatureDto.signatureId = result.id;

        return new ResponseDto(
          ResponseCode.DELETE_LIKE_ON_SIGNATURE_SUCCESS,
          true,
          '시그니처 좋아요 취소하기 성공',
          likeSignatureDto
        );


      }else{  // 좋아요 한적 없으면 시그니처 좋아요 추가
        result = await this.signatureService.addLikeOnSignature(user_id.userId,signatureId);
        likeSignatureDto.liked = result.liked;
        likeSignatureDto.signatureId = result.id;

        return new ResponseDto(
          ResponseCode.LIKE_ON_SIGNATURE_CREATED,
          true,
          '시그니처 좋아요 성공',
          likeSignatureDto
        );
      }

    }catch(error){
      console.log('addSignatureLike: ', error );
      throw error;
    }
  }

  @Get('/:signatureId') // 시그니처 상세보기
  async getSignatureDetail(
    @Body() user_id: TmpUserIdDto,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<DetailSignatureDto>> {

    try{
      // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정
      const result = await this.signatureService.detailSignature(user_id.userId, signatureId);

      return new ResponseDto(
        ResponseCode.GET_SIGNATURE_DETAIL_SUCCESS,
        true,
        "시그니처 상세보기 성공",
        result
      );
    }
    catch(error){
      console.log('Error on signatureId: ',error);
      throw error;
    }

  }

  @Patch('/:signatureId') // 시그니처 수정하기
  async patchSignatureDetail(
    @Body() user_id: TmpUserIdDto,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<any>> {
    try{
      // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정
      const result = await this.signatureService.detailSignature(user_id.userId, signatureId);

      return new ResponseDto(
        ResponseCode.GET_SIGNATURE_DETAIL_SUCCESS,
        true,
        "시그니처 상세보기 성공",
        result
      );
    }
    catch(error){
      console.log('Error on signatureId: ',error);
      throw error;
    }

  }

  @Delete('/:signatureId') // 시그니처 삭제하기
  async deleteSignatureDetail(
    @Body() user_id: TmpUserIdDto,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<any>> {
    try{
      // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정

      // [1] 시그니처 가져오기
      const signature:SignatureEntity = await SignatureEntity.findSignatureById(signatureId);
      console.log("시그니처 정보: ", signature);

      // [2] 시그니처 삭제하기
      const result = await this.signatureService.deleteSignature(signature);

      return new ResponseDto(
        ResponseCode.DELETE_SIGNATURE_SUCCESS,
        true,
        "시그니처 삭제 성공",
        null
      );
    }
    catch(error){
      return new ResponseDto(
        ResponseCode.SIGNATURE_DELETE_FAIL,
        false,
        "시그니처 삭제 실패",
        null
      );
    }

  }
}
