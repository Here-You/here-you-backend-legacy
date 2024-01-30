// date-group.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { DateGroupEntity } from './date-group.entity';
import { CreateJourneyDto } from 'src/journey/dtos/create-journey.dto';

@Injectable()
export class DateGroupRepository extends Repository<DateGroupEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(DateGroupEntity, entityManager);
  }
  // 날짜 그룹 생성
  async createDateGroup(
    createJourneyDto: CreateJourneyDto,
  ): Promise<DateGroupEntity> {
    try {
      const dateGroup = new DateGroupEntity();
      dateGroup.startDate = createJourneyDto.startDate;
      dateGroup.endDate = createJourneyDto.endDate;

      return await this.entityManager.save(dateGroup);
    } catch (error) {
      throw new Error('Failed to create DateGroup');
    }
  }
}
