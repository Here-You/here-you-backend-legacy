// cursor-page.meta.dto.ts

import { CursorPageMetaDtoParameters } from './cursor-page-options-parameter.interface';

export class CursorPageMetaDto {

  readonly total: number;
  readonly take: number;
  readonly hasNextData: boolean;
  readonly cursor: number;

  constructor({cursorPageOptionsDto, total, hasNextData, cursor}: CursorPageMetaDtoParameters) {
    this.take = cursorPageOptionsDto.take;
    this.total = total;
    this.hasNextData = hasNextData;
    this.cursor = cursor;
  }
}