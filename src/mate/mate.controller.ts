//mate.controller.ts

import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { CursorPageOptionsDto } from './cursor-page/cursor-page-option.dto';
import { MateService } from './mate.service';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';
import { MateWithCommonLocationResponseDto } from './dto/mate-with-common-location-response.dto';
import { MateProfileResponseDto } from './dto/mate-profile-response.dto';

@Controller('/mate')
export class MateController {
  constructor(private readonly mateService: MateService) {}

  @Get('/random') // 메이트 탐색 첫째 줄: 랜덤으로 메이트 추천
  @UseGuards(UserGuard)
  async getRandomMateProfileWithInfiniteCursor(
    @Req() req: Request,
    @Query() cursorPageOptionDto: CursorPageOptionsDto,
  ) {
    try {
      const result =
        await this.mateService.recommendRandomMateWithInfiniteScroll(
          cursorPageOptionDto,
          req.user.id,
        );

      return new ResponseDto(
        ResponseCode.GET_RANDOM_MATE_PROFILE_SUCCESS,
        true,
        '랜덤 메이트 추천 데이터 생성 성공',
        result,
      );
    } catch (e) {
      console.log(e);
      return new ResponseDto(
        ResponseCode.GET_RANDOM_MATE_PROFILE_FAIL,
        false,
        '랜덤 메이트 추천 데이터 생성 실패',
        null,
      );
    }
  }

  @Get('/location') // 메이트 탐색 둘째 줄: 나와 공통 장소를 사용한 메이트 추천
  @UseGuards(UserGuard)
  async getMateProfileWithMyFirstLocation(
    @Req() req: Request,
  ): Promise<ResponseDto<MateWithCommonLocationResponseDto>> {
    try {
      const result = await this.mateService.getMateProfileWithMyFirstLocation(
        req.user.id,
      );

      if (!result) {
        return new ResponseDto(
          ResponseCode.GET_MATE_WITH_COMMON_LOCATION_SUCCESS,
          true,
          '공통 메이트가 없거나 내 시그니처가 없습니다.',
          null,
        );
      }
      return new ResponseDto(
        ResponseCode.GET_MATE_WITH_COMMON_LOCATION_SUCCESS,
        true,
        '장소 기반 메이트 추천 리스트 가져오기 성공',
        result,
      );
    } catch (e) {
      console.log(e);
      return new ResponseDto(
        ResponseCode.GET_MATE_WITH_COMMON_LOCATION_FAIL,
        false,
        '장소 기반 메이트 추천 실패',
        null,
      );
    }
  }

  @Get(':mateId')
  @UseGuards(UserGuard)
  async getUserProfile(
    @Req() req: Request,
    @Param('mateId') mateId: number,
  ): Promise<ResponseDto<MateProfileResponseDto>> {
    try {
      const result = await this.mateService.findProfileWithUserId(
        req.user.id,
        mateId,
      );

      if (!result) {
        return new ResponseDto(
          ResponseCode.GET_USER_PROFILE_FAIL,
          false,
          '유저 프로필 정보 가져오기 실패',
          null,
        );
      } else {
        return new ResponseDto(
          ResponseCode.GET_USER_PROFILE_SUCCESS,
          true,
          '유저 프로필 정보 가져오기 성공',
          result,
        );
      }
    } catch (error) {
      console.log('Error at GetUserProfile: ', error);
      return new ResponseDto(
        ResponseCode.GET_USER_PROFILE_FAIL,
        false,
        '유저 프로필 정보 가져오기 실패',
        null,
      );
    }
  }

  @Get('/signature/:mateId')
  async getSignaturesWithInfiniteCursor(
    @Param('mateId') mateId: number,
    @Query() cursorPageOptionDto: CursorPageOptionsDto,
  ) {
    try {
      const result = await this.mateService.getSignaturesWithInfiniteCursor(
        cursorPageOptionDto,
        mateId,
      );

      return new ResponseDto(
        ResponseCode.GET_USER_SIGNATURES_SUCCESS,
        true,
        '메이트의 시그니처 가져오기 성공',
        result,
      );
    } catch (error) {
      console.log('Err on getUserSignatures: ', error);
      return new ResponseDto(
        ResponseCode.GET_USER_SIGNATURES_FAIL,
        false,
        '메이트의 시그니처 가져오기 실패',
        null,
      );
    }
  }
}
