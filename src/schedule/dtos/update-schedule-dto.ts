// Update-schedule.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;
}
