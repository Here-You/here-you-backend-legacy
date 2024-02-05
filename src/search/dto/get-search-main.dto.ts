// get-search-main.dto.ts

import { CoverSignatureDto } from './cover-signature.dto';

export class GetSearchMainDto{
  hot: CoverSignatureDto[];
  new: CoverSignatureDto[];
}