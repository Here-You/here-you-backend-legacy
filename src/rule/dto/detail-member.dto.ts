import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberPairDto } from './member-pair.dto';

export class DetailMemberDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberPairDto)
    memberPairs: MemberPairDto[];
}