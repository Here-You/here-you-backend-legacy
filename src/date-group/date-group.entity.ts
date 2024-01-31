// journey-date-group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { errResponse } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { JourneyEntity } from '../journey/model/journey.entity';
import { CreateJourneyDto } from 'src/journey/dtos/create-journey.dto';

@Entity()
export class DateGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @OneToMany(() => JourneyEntity, (journey) => journey.dateGroup)
  journeys: JourneyEntity[];

  // 날짜 그룹 생성
  static async createDateGroup(
    createJourneyDto: CreateJourneyDto,
  ): Promise<DateGroupEntity> {
    try {
      const dateGroup: DateGroupEntity = new DateGroupEntity();
      dateGroup.startDate = createJourneyDto.startDate;
      dateGroup.endDate = createJourneyDto.endDate;

      return await dateGroup.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
