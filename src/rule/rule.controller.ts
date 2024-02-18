import {Controller, Post, Body, Get, Param, Delete, UseGuards, Req, Query, Patch} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import {GetSearchMemberDto} from "./dto/get-search-member.dto";
import { UpdateRuleDto } from "./dto/update-rule.dto";
import {CursorPageOptionsDto} from "./dto/cursor-page.options.dto";
import {CursorPageDto} from "./dto/cursor-page.dto";
import {GetSearchMemberAtCreateDto} from "./dto/get-search-member-at-create.dto";

@Controller('mate/rule')
export class RuleController {
  constructor(
    private readonly ruleService: RuleService,
  ) {}

  // [1] 여행 규칙 상세 페이지 조회 (댓글) - 무한 스크롤 적용
  @Get('/detail/comment/:ruleId')
  @UseGuards(UserGuard)
  async getComment(@Req() req: Request,
                   @Param('ruleId') ruleId: number,
                   @Query() cursorPageOptionsDto: CursorPageOptionsDto
  ): Promise<ResponseDto<any>> {
    try {
      const result = await this.ruleService.getComment(cursorPageOptionsDto, ruleId, req.user.id);

      return new ResponseDto(
          ResponseCode.GET_COMMENT_DETAIL_SUCCESS,
          true,
          "여행 규칙 상세 페이지 (댓글) 조회 성공",
          result
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.GET_COMMENT_DETAIL_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [2] 여행 규칙 멤버 리스트 조회
  @Get('/detail/member/:ruleId')
  @UseGuards(UserGuard)
  async getMemberList(@Req() req: Request,
                      @Param('ruleId') ruleId : number) : Promise<ResponseDto<any>> {
    try {
      const memberList = await this.ruleService.getMemberList(req.user.id, ruleId);
      return new ResponseDto(
          ResponseCode.GET_MEMBER_LIST_SUCCESS,
          true,
          "여행 규칙 멤버 리스트 불러오기 성공",
          memberList
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.GET_MEMBER_LIST_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [3] 여행 규칙 참여 멤버로 초대할 메이트 검색 결과
  // [3-1] case1. 여행 규칙 생성
  @Get('/detail/search')
  @UseGuards(UserGuard)
  async getSearchMemberAtCreate(
      @Query('searchTerm')searchTerm : string,
      @Query() cursorPageOptionsDto: CursorPageOptionsDto,
      @Req() req: Request): Promise<ResponseDto<any>> {
    try {
      const result : CursorPageDto<GetSearchMemberAtCreateDto> = await this.ruleService.getSearchMemberAtCreate(cursorPageOptionsDto, req.user.id, searchTerm)
      return new ResponseDto(
          ResponseCode.GET_SEARCH_RESULT_SUCCESS,
          true,
          "초대할 메이트 검색 결과 리스트 불러오기 성공",
          result
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.GET_SEARCH_RESULT_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [3-2] case2. 여행 규칙 수정
  @Get('/detail/search/:ruleId')
  @UseGuards(UserGuard)
  async getSearchMemberAtUpdate(
      @Query('searchTerm')searchTerm : string,
      @Query() cursorPageOptionsDto: CursorPageOptionsDto,
      @Param('ruleId') ruleId: number,
      @Req() req: Request): Promise<ResponseDto<any>> {
    try {
      const result : CursorPageDto<GetSearchMemberDto> = await this.ruleService.getSearchMemberAtUpdate(cursorPageOptionsDto, req.user.id, ruleId, searchTerm)
      return new ResponseDto(
          ResponseCode.GET_SEARCH_RESULT_SUCCESS,
          true,
          "초대할 메이트 검색 결과 리스트 불러오기 성공",
          result
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.GET_SEARCH_RESULT_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [4] 여행 규칙 상세 페이지 조회 (게시글)
  @Get('/detail/:ruleId')
  @UseGuards(UserGuard)
  async getDetail(@Req() req: Request,
                  @Param('ruleId') ruleId: number): Promise<ResponseDto<any>> {

    const result = await this.ruleService.getDetail(req.user.id, ruleId);

    try {
      const result = await this.ruleService.getDetail(req.user.id, ruleId);
      return new ResponseDto(
          ResponseCode.GET_RULE_DETAIL_SUCCESS,
          true,
          "여행 규칙 상세 페이지 (게시글) 조회 성공",
          result
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.GET_RULE_DETAIL_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [5] 여행 규칙 수정
  @Patch('/detail/:ruleId')
  @UseGuards(UserGuard)
  async updateRule(@Body() updateRuleDto: UpdateRuleDto,
                   @Req() req: Request,
                   @Param('ruleId') ruleId: number): Promise<ResponseDto<any>> {

    try {
      const result = await this.ruleService.updateRule(updateRuleDto, req.user.id, ruleId);
      return new ResponseDto(
          ResponseCode.PATCH_RULE_SUCCESS,
          true,
          "여행 규칙 수정 성공",
          result
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.PATCH_RULE_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [6] 여행 규칙 생성
  @Post('/detail')
  @UseGuards(UserGuard)
  async createRule(@Req() req: Request,
                   @Body() createRuleDto: CreateRuleDto): Promise<ResponseDto<any>> {
    try {
      const result = await this.ruleService.createRule(createRuleDto, req.user.id);
      return new ResponseDto(
          ResponseCode.RULE_CREATED,
          true,
          "여행 규칙 생성 성공",
          result
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.RULE_CREATION_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [7] 여행 규칙 나가기
  @Delete('/:ruleId')
  @UseGuards(UserGuard)
  async deleteInvitation(@Req() req: Request,
                         @Param('ruleId') ruleId: number){
    try {
      await this.ruleService.deleteInvitation(ruleId, req.user.id);
      return new ResponseDto(
          ResponseCode.DELETE_INVITATION_SUCCESS,
          true,
          "여행 규칙 나가기 성공",
          null
      );
    } catch (e) {
      return new ResponseDto(
          ResponseCode.DELETE_INVITATION_FAIL,
          false,
          e.message,
          null
      );
    }
  }

  // [8] 여행 규칙 전체 리스트 조회
  @Get()
  @UseGuards(UserGuard)
  async getRuleList(@Req() req: Request): Promise<ResponseDto<any>> {
    try {
      const result = await this.ruleService.getRuleList(req.user.id);
      return new ResponseDto(
          ResponseCode.GET_RULE_LIST_SUCCESS,
          true,
          "여행 규칙 전체 리스트 조회 성공",
          result);
    } catch (e) {
      return new ResponseDto(
          ResponseCode.GET_RULE_LIST_FAIL,
          false,
          e.message,
          null);
    }
  }
}