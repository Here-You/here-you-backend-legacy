import {Controller, Post, Body, Get, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { MetaToBackDto } from './dto/meta-to-back.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';

@Controller('mate/rule')
export class RuleController {
  constructor(
    private readonly ruleService: RuleService,
  ) {}

  // 여행 규칙 생성
  @Post('/write')
  @UseGuards(UserGuard)
  async createRule(@Req() req: Request, @Body() createRuleDto: CreateRuleDto): Promise<ResponseDto<any>> {
    const result = await this.ruleService.createRule(createRuleDto, req.user.id);

    if(!result){
      return new ResponseDto(
        ResponseCode.RULE_CREATION_FAIL,
        false,
        "여행 규칙 생성 실패",
        null);

    }
    else{
      return new ResponseDto(
        ResponseCode.RULE_CREATED,
        true,
        "여행 규칙 생성 성공",
        result);
    }
  }

  // 여행 규칙 및 댓글 조회
  @Get('/detail/:ruleId')
  @UseGuards(UserGuard)
  async getDetail(@Req() req: Request, @Param('ruleId') ruleId: number, @Body() metaToBackDto: MetaToBackDto): Promise<ResponseDto<any>> {
    
    const result = await this.ruleService.getDetail(ruleId, metaToBackDto);

    if(!result){
      return new ResponseDto(
        ResponseCode.GET_RULE_DETAIL_FAIL,
        false,
        "여행 규칙 및 댓글 조회 실패",
        null
      );
    }
    else{
      return new ResponseDto(
        ResponseCode.GET_RULE_DETAIL_SUCCESS,
        true,
        "여행 규칙 및 댓글 조회 성공",
        result
      );
    }
  }

  // 여행 규칙 나가기
  @Delete('/:ruleId')
  @UseGuards(UserGuard)
  async deleteInvitation(@Req() req: Request, @Param('ruleId') ruleId: number){

    // 현재 로그인한 사용자 ID
    // const userId = req.user.id;
    const userId = 2;

    try {
      await this.ruleService.deleteInvitation(ruleId, userId);
      return new ResponseDto(
          ResponseCode.DELETE_INVITATION_SUCCESS,
          true,
          "여행 규칙 나가기 성공",
          null
      );
    } catch (error) {
      return new ResponseDto(
          ResponseCode.DELETE_INVITATION_FAIL,
          false,
          "여행 규칙 나가기 실패",
          null
      );
    }

  }
}