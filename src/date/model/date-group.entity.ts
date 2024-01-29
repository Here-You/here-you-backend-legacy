// journey-date-group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JourneyEntity } from '../../journey/model/journey.entity';

@Entity('dateGroup')
export class DateGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @OneToMany(() => JourneyEntity, (journey) => journey.dateGroup)
  journeys: JourneyEntity[];
}
