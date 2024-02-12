import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  Between,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { startOfMonth, endOfMonth } from 'date-fns';
import { BaseResponse } from 'src/response/response.status';
import { DetailScheduleEntity } from '../detail-schedule/detail-schedule.entity';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { JourneyEntity } from 'src/journey/model/journey.entity';
import { MonthInfoDto } from 'src/map/month-info.dto';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => LocationEntity, (location) => location.schedules, {
    nullable: true,
  })
  location: LocationEntity | null;

  @ManyToOne(() => JourneyEntity, (journey) => journey.schedules, {
    onDelete: 'CASCADE',
  })
  journey: JourneyEntity;

  @OneToMany(
    () => DetailScheduleEntity,
    (detailSchedule) => detailSchedule.schedule,
  )
  detailSchedules: DetailScheduleEntity[];

  @OneToOne(() => DiaryEntity, (diary) => diary.schedule)
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  //일정 작성하기
  static async createSchedule(journey: JourneyEntity, currentDate) {
    const schedule = new ScheduleEntity();
    schedule.date = currentDate;
    schedule.journey = journey;
    return await schedule.save();
  }

  //일정 작성하기 : title
  static async updateScheduleTitle(
    schedule: ScheduleEntity,
    updateScheduleDto,
  ) {
    schedule.title = updateScheduleDto.title;
    return await schedule.save();
  }

  //일정 작성하기 : location
  static async updateScheduleLocation(
    schedule: ScheduleEntity,
    location: LocationEntity,
  ) {
    schedule.location = location;
    return await schedule.save();
  }

  //일정 삭제하기 - 여정 삭제했을때
  static async deleteSchedule(schedule) {
    return await ScheduleEntity.remove(schedule);
  }

  //일정 리셋하기 - 제목, 위치
  static async resetSchedule(schedule: ScheduleEntity) {
    schedule.title = '';
    schedule.location = null;
    await schedule.save();
  }

  //일정 조회하기
  static async findExistSchedule(scheduleId): Promise<ScheduleEntity> {
    const schedule = await ScheduleEntity.findOne({
      where: { id: scheduleId },
      relations: ['location'],
    });
    if (!schedule) {
      throw new NotFoundException(BaseResponse.SCHEDULE_NOT_FOUND);
    }
    return schedule;
  }

  static async findExistLocation(scheduleId): Promise<LocationEntity> {
    const schedule = await ScheduleEntity.findOne({
      where: { id: scheduleId },
      relations: ['location'],
    });
    return schedule.location;
  }

  static async findExistLocations(location: LocationEntity) {
    const existLocation = await ScheduleEntity.find({
      where: {
        location: location,
      },
      relations: ['location'],
    });
    return existLocation;
  }

  //journeyId로 일정 조회하기
  static async findExistSchedulesByJourneyId(
    journeyId: number,
  ): Promise<ScheduleEntity[]> {
    const schedules = await ScheduleEntity.find({
      where: { journey: { id: journeyId } },
      relations: ['location'],
    });
    return schedules;
  }

  static async findExistScheduleByOptions(journeyId, scheduleId) {
    const schedule = await ScheduleEntity.find({});
  }
  // 월별 일정 조회하기
  static async findMonthlySchedule(
    journeyId,
    dates: MonthInfoDto,
  ): Promise<ScheduleEntity[]> {
    const firstDate = new Date(dates.year, dates.month - 1, 1);
    const lastDate = new Date(dates.year, dates.month, 0);
    console.log('startDate : ', firstDate, 'lastDate', lastDate);
    const monthlySchedule = await ScheduleEntity.find({
      where: {
        journey: { id: journeyId },
        date: Between(firstDate, lastDate),
      },
      relations: ['location'],
    });
    for (const schedule of monthlySchedule) {
      console.log(schedule.date);
    }
    return monthlySchedule;
  }
}
