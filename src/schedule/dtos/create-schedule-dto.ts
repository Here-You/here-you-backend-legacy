// create-schedule.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  title: string;

  @IsString()
  participant: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
