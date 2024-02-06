import { IsNotEmpty, IsString } from 'class-validator';

export class RulePairDto {
    @IsNotEmpty()
    @IsString()
    ruleTitle: string;
  
    @IsNotEmpty()
    @IsString()
    ruleDetail: string;
}