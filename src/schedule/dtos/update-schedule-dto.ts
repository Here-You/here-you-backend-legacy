// Update-schedule.dto.ts
import { IsString } from 'class-validator';

export class UpdateScheduleTitleDto {
  @IsString()
  title: string;
}
