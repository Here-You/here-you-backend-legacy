import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RulePairDto} from "./rule-pair.dto";

export class CreateRuleDto {
  @IsNotEmpty()
  @IsString()
  mainTitle: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RulePairDto)
  rulePairs: RulePairDto[];

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  invitedId: number[];
}
