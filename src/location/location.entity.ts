import { ScheduleEntity } from 'src/schedule/schedule.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class LocationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @OneToOne(() => ScheduleEntity, (schedule) => schedule.locationId)
  schedule: ScheduleEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createLocation(scheduleLocation) {
    try {
      const location: LocationEntity = new LocationEntity();
      location.latitude = scheduleLocation.latitude;
      location.longitude = scheduleLocation.longitude;

      return await location.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateLocation(schedule, scheduleLocation) {
    try {
      const location = await LocationEntity.findOneOrFail({
        where: { id: schedule.locationId },
      });
      location.latitude = scheduleLocation.latitude;
      location.longitude = scheduleLocation.longitude;

      return await location.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
