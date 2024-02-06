import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberPairDto } from './member-pair.dto';

export class TotalListDto {
    @IsNotEmpty()
    @IsNumber()
    ruleId: number;

    @IsNotEmpty()
    @IsNumber()
    memberCnt: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsDate()
    updated: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberPairDto)
    memberPairs: MemberPairDto[];
}