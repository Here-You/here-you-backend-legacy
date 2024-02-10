// signature.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { DetailSignatureDto } from './dto/detail-signature.dto';
import { SignatureEntity } from './domain/signature.entity';
import { SignatureLikeEntity } from './domain/signature.like.entity';
import { LikeSignatureDto } from './dto/like-signature.dto';
import { GetLikeListDto } from './dto/get-like-list.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';

@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('/') // 시그니처 탭 메인: 내 시그니처 목록
  @UseGuards(UserGuard)
  async getMySignature(@Req() req: Request): Promise<ResponseDto<HomeSignatureDto[]>> {

    const result = await this.signatureService.homeSignature(req.user.id);

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

  @Post('/new') // 시그니처 생성하기
  @UseGuards(UserGuard)
  async createNewSignature(
    @Body() newSignature: CreateSignatureDto,
    @Req() req: Request
  ): Promise<ResponseDto<any>> {
    const result = await this.signatureService.createSignature(newSignature, req.user.id);

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
  @UseGuards(UserGuard)
  async patchSignatureLike(
    @Param('signatureId') signatureId: number,
    @Req() req: Request
  ): Promise<ResponseDto<LikeSignatureDto>> {
    try{

      // [1] 이미 좋아요 했는지 확인
      const liked: SignatureLikeEntity= await this.signatureService.findIfAlreadyLiked(req.user.id,signatureId);
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
        result = await this.signatureService.addLikeOnSignature(req.user.id,signatureId);
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
  @UseGuards(UserGuard)
  async getSignatureDetail(
    @Req() req: Request,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<DetailSignatureDto>> {

    try{
      // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정
      const result = await this.signatureService.detailSignature(req.user.id, signatureId);

      if(result == null){
        return new ResponseDto(
          ResponseCode.SIGNATURE_NOT_FOUND,
          false,
          "존재하지 않는 시그니처 입니다",
          result
        );
      }

      if(result.author.is_followed){  // 작성자가 본인이 아닌 경우
        if(result.author._id == null){  // 작성자가 탈퇴한 경우
          return new ResponseDto(
            ResponseCode.GET_SIGNATURE_DETAIL_SUCCESS,
            true,
            "시그니처 상세보기 성공: 작성자 탈퇴",
            result
          );
        }
        else{
          return new ResponseDto(
            ResponseCode.GET_SIGNATURE_DETAIL_SUCCESS,
            true,
            "시그니처 상세보기 성공: 메이트의 시그니처",
            result
          );
        }
      }
      else{ // 작성자가 본인인 경우 author 없음
        return new ResponseDto(
          ResponseCode.GET_SIGNATURE_DETAIL_SUCCESS,
          true,
          "시그니처 상세보기 성공: 내 시그니처",
          result
        );
      }
    }
    catch(error){
      console.log('Error on signatureId: ',error);
      throw error;
    }

  }

  @Patch('/:signatureId') // 시그니처 수정하기
  async patchSignature(
    @Body() patchSignatureDto: CreateSignatureDto,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<any>> {
    try{
      // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정
      const result = await this.signatureService.patchSignature(signatureId, patchSignatureDto);

      if(result == null) {
        return new ResponseDto(
          ResponseCode.SIGNATURE_NOT_FOUND,
          false,
          "존재하지 않는 시그니처 입니다",
          result
        );
      }

      return new ResponseDto(
        ResponseCode.PATCH_SIGNATURE_SUCCESS,
        true,
        "시그니처 수정하기 성공",
        result
      );
    }
    catch(error){
      console.log(error);
      return new ResponseDto(
        ResponseCode.SIGNATURE_PATCH_FAIL,
        false,
        "시그니처 수정하기 실패",
        null
      );
    }

  }

  @Delete('/:signatureId') // 시그니처 삭제하기
  async deleteSignature(
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<any>> {
    try{
      // 임시로 토큰이 아닌 유저 아이디 받도록 구현 -> 리펙토링 예정

      // [1] 시그니처 가져오기
      const signature:SignatureEntity = await SignatureEntity.findSignatureById(signatureId);
      console.log("시그니처 정보: ", signature);

      if(signature == null) {
        return new ResponseDto(
          ResponseCode.SIGNATURE_NOT_FOUND,
          false,
          "존재하지 않는 시그니처 입니다",
          null
        );
      }

      // [2] 시그니처 삭제하기
      await this.signatureService.deleteSignature(signature);

      return new ResponseDto(
        ResponseCode.DELETE_SIGNATURE_SUCCESS,
        true,
        "시그니처 삭제 성공",
        null
      );
    }
    catch(error){
      console.log(error);
      return new ResponseDto(
        ResponseCode.SIGNATURE_DELETE_FAIL,
        false,
        "시그니처 삭제 실패",
        null
      );
    }
  }

  @Get('/like/:signatureId') // 시그니처에 좋아요한 사용자 목록
  @UseGuards(UserGuard)
  async getSignatureLikeList(
    @Req() req: Request,
    @Param('signatureId') signatureId: number
  ): Promise<ResponseDto<GetLikeListDto>> {
    try{
      const getLikeListDto:GetLikeListDto = await this.signatureService.getSignatureLikeList(req.user.id, signatureId);

      return new ResponseDto(
        ResponseCode.GET_LIKE_SIGNATURE_PROFILES_SUCCESS,
        true,
        "시그니처 좋아요 목록 불러오기 성공",
        getLikeListDto
      );

    }
    catch(error){
      return new ResponseDto(
        ResponseCode.GET_LIKE_SIGNATURE_PROFILES_FAIL,
        false,
        "시그니처 좋아요 목록 불러오기 실패",
        null
      );
    }
  }

}
