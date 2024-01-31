// data-group.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { CreateJourneyDto } from '../journey/dtos/create-journey.dto';
import { DateGroupEntity } from './date-group.entity';

@Injectable()
export class DateGroupService {
  async createDateGroup(createJourneyDto: CreateJourneyDto) {
    // DateGroup 생성
    const dateGroup: DateGroupEntity = await DateGroupEntity.createDateGroup(
      createJourneyDto,
    );
    if (!dateGroup) {
      throw new BadRequestException();
    }
    console.log(dateGroup.id);
    return response(BaseResponse.DATEGROUP_CREATED, dateGroup);
  }
}
