import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RulePairDto {
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

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    image: string;
}

export class DetailRuleDto {
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