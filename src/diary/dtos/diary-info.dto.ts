import { IsString, IsEnum, IsDate, IsInt } from 'class-validator';

export class DiaryInfoDto {
  @IsInt()
  id: number;

  @IsDate()
  date: Date;

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

  @IsInt()
  imageId: number;

  @IsString()
  imageUrl: string;
}
