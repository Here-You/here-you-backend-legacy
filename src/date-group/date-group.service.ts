// data-group.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { MESSAGE } from '../constants/response';
import { DateGroupRepository } from './date-group.repository';
import { CreateJourneyDto } from '../journey/dtos/create-journey.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DateGroupEntity } from './date-group.entity';

@Injectable()
export class DateGroupService {
  constructor(
    @InjectRepository(DateGroupEntity)
    private readonly dateGroupRepository: DateGroupRepository,
  ) {}

  async createDateGroup(createJourneyDto: CreateJourneyDto): Promise<number> {
    // DateGroup 생성
    const dateGroup = await this.dateGroupRepository.createDateGroup(
      createJourneyDto,
    );
    if (!dateGroup) {
      throw new BadRequestException(MESSAGE.WRONG_INPUT);
    }

    return dateGroup.id;
  }
}
