import { Injectable, HttpException } from '@nestjs/common';
import { MemberListConverter } from './member.list.converter';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
    constructor(
        private memberListConverter: MemberListConverter,
    ) {}

    // [1] 여행 규칙 멤버 리스트 조회
    async getMemberList(userId: number, ruleId: number): Promise<MemberDto[]> {
        const memberDto: MemberDto[] = await this.memberListConverter.toDto(userId, ruleId);

        return memberDto;
    }

    // [2] 여행 규칙 멤버 초대

    // [3] 여행 규칙 멤버 삭제
}