// create-signature.dto.ts

import { pageSignatureDto } from './page-signature.dto';

export class CreateSignatureDto {
  title: string;
  pages: pageSignatureDto[];
}
