// mate-with-common-location.dto.ts

import { MateRecommendProfileDto } from './mate-recommend-profile.dto';

export class MateWithCommonLocationResponseDto{
  location: string;
  mateProfiles: MateRecommendProfileDto[];
}