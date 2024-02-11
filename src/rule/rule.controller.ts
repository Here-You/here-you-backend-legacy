import {Controller, Post, Body, Get, Param, Delete, UseGuards, Req, Query} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import {FollowSearchDto} from "../follow/dto/follow.search.dto";
import {GetSearchMemberDto} from "./dto/get.search.member.dto";

@Controller('mate/rule')
export class RuleController {
  constructor(
    private readonly ruleService: RuleService,
  ) {}

  // [1] 여행 규칙 멤버 리스트 조회
  @Get('member/:ruleId')
  async getMemberList(@Param('ruleId') ruleId : number) : Promise<ResponseDto<any>> {
    try {
      const memberList = await this.ruleService.getMemberList(ruleId);
      return new ResponseDto(
          ResponseCode.GET_MEMBER_LIST_SUCCESS,
          true,
          "여행 규칙 멤버 리스트 불러오기 성공",
          memberList
      );
    } catch (error) {
      return new ResponseDto(
          ResponseCode.GET_MEMBER_LIST_FAIL,
          false,
          "여행 규칙 멤버 리스트 불러오기 실패",
          null
      );
    }
  }

  // [2] 여행 규칙 조회
  @Get('/detail/:ruleId')
  @UseGuards(UserGuard)
  async getDetail(@Req() req: Request, @Param('ruleId') ruleId: number): Promise<ResponseDto<any>> {

    const result = await this.ruleService.getDetail(ruleId);

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

  // [3] 여행 규칙 전체 리스트 조회
  @Get('list')
  @UseGuards(UserGuard)
  async getRuleList(@Req() req: Request): Promise<ResponseDto<any>> {
    const result = await this.ruleService.getRuleList(req.user.id);

    if(!result){
      return new ResponseDto(
          ResponseCode.GET_RULE_LIST_FAIL,
          false,
          "여행 규칙 전체 리스트 조회 실패",
          null);

    }
    else{
      return new ResponseDto(
          ResponseCode.GET_RULE_LIST_SUCCESS,
          true,
          "여행 규칙 전체 리스트 조회 성공",
          result);
    }
  }

  // [3] 여행 규칙 생성
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

  // [4] 여행 규칙 참여 멤버로 초대할 메이트 검색 결과
  @Get('/write/search/:ruleId')
  @UseGuards(UserGuard)
  async getSearchMember(
      @Query('searchTerm')searchTerm : string,
      @Param('ruleId') ruleId: number,
      @Req() req: Request): Promise<ResponseDto<any>> {
    try {
      const getSearchMemberDto : GetSearchMemberDto[] = await this.ruleService.getSearchMember(req.user.id, ruleId, searchTerm)
      return new ResponseDto(
          ResponseCode.GET_SEARCH_RESULT_SUCCESS,
          true,
          "초대할 메이트 검색 결과 리스트 불러오기 성공",
          getSearchMemberDto
      );
    } catch (error) {
      return new ResponseDto(
          ResponseCode.GET_SEARCH_RESULT_FAIL,
          false,
          "초대할 메이트 검색 결과 리스트 불러오기 실패",
          null
      );
    }
  }


  // 여행 규칙 나가기
  /*
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
   */
}