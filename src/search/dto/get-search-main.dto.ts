// get-search-main.dto.ts

import { SignatureCoverDto } from './signature-cover.dto';

export class GetSearchMainDto{
  hot: SignatureCoverDto[];
  new: SignatureCoverDto[];
}