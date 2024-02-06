import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RulePairDto {
    @IsNotEmpty()
    @IsString()
    ruleTitle: string;

    @IsNotEmpty()
    @IsString()
    ruleDetail: string;
}

export class EditRuleDto {
    @IsNotEmpty()
    @IsString()
    mainTitle: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RulePairDto)
    rulePairs: RulePairDto[];
}