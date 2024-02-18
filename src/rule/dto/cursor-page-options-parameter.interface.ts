import { CursorPageOptionsDto } from './cursor-page.options.dto';

export interface CursorPageMetaDtoParameters {
  cursorPageOptionsDto: CursorPageOptionsDto;
  total: number;
  hasNextData: boolean;
  cursor: number;
}
