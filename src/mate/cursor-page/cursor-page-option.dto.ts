// cursor-page.options.dto.ts

import { Type } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { Order } from './cursor-page-order.enum';

export class CursorPageOptionsDto {

  @Type(() => String)
  @IsEnum(Order)
  @IsOptional()
  readonly sort?: Order = Order.DESC;

  @Type(() => Number)
  @IsOptional()
  readonly take?: number = 5;

  @Type(() => String)
  @IsOptional()
  readonly cursorId?: number = "" as any;
}