// date-group.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateGroupEntity } from './model/date-group.entity';
import { CreateJourneyDto } from 'src/journey/dtos/create-journey.dto';

@Injectable()
export class DateGroupRepository {
  constructor(
    @InjectRepository(DateGroupEntity)
    private readonly dateGroup: Repository<DateGroupEntity>,
  ) {}

  //날짜 그룹 생성
  async createDateGroup(
    createJourneyDto: CreateJourneyDto,
  ): Promise<DateGroupEntity> {
    try {
      const dateGroup = await this.dateGroup.save(createJourneyDto);
      return dateGroup;
    } catch (error) {
      throw new Error('fail');
    }
  }
}
