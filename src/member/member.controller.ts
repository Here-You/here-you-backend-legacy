import { Controller, Post, Req, UseGuards, Param, Delete, Get } from '@nestjs/common';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { MemberService } from './member.service'; 
import { RuleService } from 'src/rule/rule.service';
import { RuleMainEntity } from 'src/rule/domain/rule.main.entity';
import {UserSearchDto} from "../user/user.search.dto";
import { UserService} from "../user/user.service";
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';

// @UseGuards(UserGuard)
@Controller('mate/rule/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly ruleService: RuleService,
    private readonly userService: UserService,
  ) {}

  // [1] 여행 규칙 멤버 리스트 조회
  @Get('/:ruleId')
  @UseGuards(UserGuard)
  async getMember(@Req() req: Request, @Param('ruleId') ruleId : number) : Promise<ResponseDto<any>> {
    // 현재 로그인한 사용자 ID
    // const userId = req.user.id;
    // const userId = 2;

    try {
        const memberList = await this.memberService.getMemberList(req.user.id, ruleId);
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

  // [2] 여행 규칙 멤버 초대
  @Post('/:ruleId/:invitedId')
  @UseGuards(UserGuard)
  async createInvitation(@Req() req: Request, @Param('ruleId') ruleId : number, @Param('invitedId') invitedId : number) : Promise<ResponseDto<any>> {
    // 현재 로그인한 사용자 ID
    // const userId = req.user.id;
    // const userId = 2;

    // 이미 초대된 멤버인지 확인
    const ruleEntity = await RuleMainEntity.findRuleById(ruleId);
    console.log('--이미 참여하는 사용자인지 검증 시작--')
    const check = this.ruleService.checkMember(ruleEntity, invitedId);
    if (check) {
        return new ResponseDto(
            ResponseCode.IS_ALREADY_MEMBER,
            false,
            "이미 초대된 사용자입니다",
            null
        );
    }
    console.log('초대 가능한 사용자 입니다')
    console.log('--검증 완료--')

    // 멤버 초대
    try {
        await this.memberService.createInvitation(ruleId, req.user.id, invitedId);
        return new ResponseDto(
            ResponseCode.INVITATION_CREATED,
            true,
            "여행 규칙 멤버 초대 성공",
            null
        );
    } catch (error) {
        return new ResponseDto(
            ResponseCode.INVITATION_FAIL,
            false,
            "여행 규칙 멤버 초대 실패",
            null
        );
    }
  }

  // [3] 여행 규칙 멤버 삭제
  @Delete('/:ruleId/:memberId')
  @UseGuards(UserGuard)
  async deleteMember(@Req() req: Request, @Param('ruleId') ruleId : number, @Param('memberId') memberId : number) : Promise<ResponseDto<any>> {
    // 현재 로그인한 사용자 ID
    // const userId = req.user.id;
    // const userId = 2;

    try {
        await this.memberService.deleteMember(ruleId, memberId);
        return new ResponseDto(
            ResponseCode.DELETE_MEMBER_SUCCESS,
            true,
            "여행 규칙 멤버 삭제 성공",
            null
        );
    } catch (error) {
        return new ResponseDto(
            ResponseCode.DELETE_MEMBER_FAIL,
            false,
            "여행 규칙 멤버 삭제 실패",
            null
        );
    }
  }

    // [4] 초대할 여행 규칙 멤버 검색
    @Get('/search/:searchTerm')
    @UseGuards(UserGuard)
    async getSearchResult(
        @Req() req: Request,
        @Param('searchTerm') searchTerm: string): Promise<ResponseDto<any>> {
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        // const userId = 1;

        try {
            const userSearchDto : UserSearchDto[] = await this.userService.getSearchResult(req.user.id, searchTerm)
            return new ResponseDto(
                ResponseCode.GET_SEARCH_RESULT_SUCCESS,
                true,
                "검색 결과 리스트 불러오기 성공",
                userSearchDto
            );
        } catch (error) {
            return new ResponseDto(
                ResponseCode.GET_SEARCH_RESULT_FAIL,
                false,
                "검색 결과 리스트 불러오기 실패",
                null
            );
        }
    }
}