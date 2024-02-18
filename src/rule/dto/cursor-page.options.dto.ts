import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Order } from './cursor-page-order.enum';

export class CursorPageOptionsDto {
  @Type(() => String)
  @IsEnum(Order)
  @IsOptional()
  sort?: Order = Order.DESC;

  @Type(() => Number)
  @IsOptional()
  take?: number = 5;

  @Type(() => Number)
  @IsOptional()
  cursorId?: number = '' as any;
}
