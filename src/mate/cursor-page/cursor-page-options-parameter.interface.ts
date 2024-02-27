import { CursorPageOptionsDto } from './cursor-page-option.dto';

export interface CursorPageMetaDtoParameters {
  cursorPageOptionsDto: CursorPageOptionsDto;
  total: number;
  hasNextData: boolean;
  cursor: number;
}
