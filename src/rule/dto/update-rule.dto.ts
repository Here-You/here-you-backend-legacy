import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRulePairDto {
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    ruleNumber: number;

    @IsNotEmpty()
    @IsString()
    ruleTitle: string;

    @IsNotEmpty()
    @IsString()
    ruleDetail: string;
}

export class UpdateRuleDto {
    @IsNotEmpty()
    @IsString()
    mainTitle: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateRulePairDto)
    rulePairs: UpdateRulePairDto[];

    @IsArray()
    @IsNumber({}, { each: true })
    membersId: number[];
}