import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RulePairDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    ruleTitle: string;

    @IsNotEmpty()
    @IsString()
    ruleDetail: string;
}

export class DetailMemberDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    image: string;
}

export class DetailRuleDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    mainTitle: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => RulePairDto)
    rulePairs: RulePairDto[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => DetailMemberDto)
    detailMembers: DetailMemberDto[];
}