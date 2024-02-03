import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RulePairDto {
  @IsNotEmpty()
  @IsString()
  ruleTitle: string;

  @IsNotEmpty()
  @IsString()
  ruleDetail: string;
}

export class CreateRuleDto {
  @IsNotEmpty()
  @IsString()
  mainTitle: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RulePairDto)
  rulePairs: RulePairDto[];

  @IsNotEmpty()
  @IsNumber()
  inviterId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  invitedId: number[];

  @IsNotEmpty()
  @IsNumber()
  ruleId: number;
}
