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

  @OneToOne(() => ScheduleEntity, (schedule) => schedule.location)
  schedule: ScheduleEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createLocation(updateScheduleDto) {
    try {
      const location: LocationEntity = new LocationEntity();
      location.latitude = updateScheduleDto.latitude;
      location.longitude = updateScheduleDto.longitude;

      return await location.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateLocation(schedule, updateScheduleDto) {
    try {
      const location = await LocationEntity.findOneOrFail({
        where: { id: schedule.locationId },
      });
      location.latitude = updateScheduleDto.latitude;
      location.longitude = updateScheduleDto.longitude;

      return await location.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async findExistLocation(updateScheduleDto) {
    {
    }
    const location = await LocationEntity.findOne({
      where: {
        latitude: updateScheduleDto.latitude,
        longitude: updateScheduleDto.longitude,
      },
    });
    return location;
  }
}
