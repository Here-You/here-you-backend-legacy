import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class MemberPairDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}

export class GetRuleListDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  updated: Date;

  @IsNotEmpty()
  @IsNumber()
  memberCnt: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberPairDto)
  memberPairs: MemberPairDto[];
}
