import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class DetailScheduleInfoDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;

  @IsNumber()
  schedule_id: number;
}

export class DetailContentDto {
  @IsOptional()
  @IsString()
  content: string;
}
