// date-group.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateGroupEntity } from './model/date-group.entity';

@Injectable()
export class DateGroupRepository {
  constructor(
    @InjectRepository(DateGroupEntity)
    private readonly dateGroup: Repository<DateGroupEntity>,
  ) {}
}
