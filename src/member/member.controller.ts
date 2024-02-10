import { Controller, Post, Req, UseGuards, Param, Delete, Get } from '@nestjs/common';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { MemberService } from './member.service';
// import {UserSearchDto} from "../follow/dto/follow.search.dto";
import { UserService} from "../user/user.service";
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import {RuleInvitationEntity} from "../rule/domain/rule.invitation.entity";
import {UserEntity} from "../user/user.entity";

// @UseGuards(UserGuard)
@Controller('mate/rule/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly userService: UserService,
  ) {}

  // [2] 여행 규칙 멤버 초대
  @Post('/invite/:ruleId/:invitedId')
  async createInvitation(@Param('ruleId') ruleId : number, @Param('invitedId') invitedId : number) : Promise<ResponseDto<any>> {
      const result = await this.memberService.createInvitation(ruleId, invitedId);

      return result;
  }

  // [3] 여행 규칙 멤버 삭제
  @Delete('/delete/:ruleId/:memberId')
  async deleteMember(@Param('ruleId') ruleId : number, @Param('memberId') memberId : number) : Promise<ResponseDto<any>> {
      const result = await this.memberService.deleteMember(ruleId, memberId);

      return result;
  }

    // [4] 초대할 여행 규칙 멤버 검색
    /*
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
     */
}