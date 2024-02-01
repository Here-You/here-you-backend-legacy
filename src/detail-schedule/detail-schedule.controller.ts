import { Controller } from '@nestjs/common';
import { DetailScheduleService } from './detail-schedule.service';

@Controller('api/detail-schedule')
export class DetailScheduleController {
  constructor(private readonly detailScheduleService: DetailScheduleService) {}
}
