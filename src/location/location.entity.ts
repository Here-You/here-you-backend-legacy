import { ScheduleEntity } from 'src/schedule/schedule.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class LocationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.location)
  schedules: ScheduleEntity[];

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

  static async updateLocation(location: LocationEntity, updateScheduleDto) {
    try {
      const updateLocation = await LocationEntity.findOneOrFail({
        where: { id: location.id },
      });
      updateLocation.latitude = updateScheduleDto.latitude;
      updateLocation.longitude = updateScheduleDto.longitude;

      return await updateLocation.save();
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

  static async findExistLocationById(schedule) {
    const existLocation = await LocationEntity.findOne({
      where: { schedules: {} },
    });
    return existLocation;
  }
}
