// journey-date-group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { JourneyEntity } from '../journey/model/journey.entity';
import { CreateDateGroupDto } from './dtos/create-date-group.dto';

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
    createDateGroupDto: CreateDateGroupDto,
  ): Promise<DateGroupEntity> {
    try {
      const dateGroup: DateGroupEntity = new DateGroupEntity();
      dateGroup.startDate = createDateGroupDto.startDate;
      dateGroup.endDate = createDateGroupDto.endDate;

      return await dateGroup.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
