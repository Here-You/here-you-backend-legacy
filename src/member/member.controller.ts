import { Controller, Post, Req, UseGuards, Param, Delete, Get } from '@nestjs/common';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { MemberService } from './member.service'; 
// import { UserGuard } from 'src/user/user.guard';

// @UseGuards(UserGuard)
@Controller('mate/rule/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) {}

  // [1] 여행 규칙 멤버 리스트
  @Get('/:ruleId')
  async getMember(@Param('ruleId') ruleId : number) : Promise<ResponseDto<any>> {
    // 현재 로그인한 사용자 ID
    // const userId = req.user.id;
    const userId = 1;

    try {
        const memberList = await this.memberService.getMemberList(userId, ruleId);
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
}