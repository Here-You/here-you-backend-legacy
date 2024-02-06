import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RulePairDto {
    @IsNotEmpty()
    @IsString()
    ruleId: string;

    @IsNotEmpty()
    @IsString()
    ruleTitle: string;

    @IsNotEmpty()
    @IsString()
    ruleDetail: string;
}

export class UpdateRuleDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    mainTitle: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RulePairDto)
    rulePairs: RulePairDto[];
}