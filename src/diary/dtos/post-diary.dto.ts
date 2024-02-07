import { IsString, IsOptional, IsEnum } from 'class-validator';

export class PostDiaryDto {
  @IsString()
  title: string;

  @IsString()
  place: string;

  @IsEnum(['CLOUDY', 'RAINY', 'SNOWY', 'PARTLY_CLOUDY', 'SUNNY'])
  weather: 'CLOUDY' | 'RAINY' | 'SNOWY' | 'PARTLY_CLOUDY' | 'SUNNY';

  @IsEnum(['ANGRY', 'SAD', 'SMILE', 'HAPPY', 'SHOCKED'])
  mood: 'ANGRY' | 'SAD' | 'SMILE' | 'HAPPY' | 'SHOCKED';

  @IsString()
  content: string;

  @IsString()
  fileName: string;
}
