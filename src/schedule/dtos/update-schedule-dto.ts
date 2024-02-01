// Update-schedule.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class UpdateScheduleTitleDto {
  @IsString()
  title: string;
}
