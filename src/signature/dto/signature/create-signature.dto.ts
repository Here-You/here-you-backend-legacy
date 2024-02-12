// create-signature.dto.ts

import { PageSignatureDto } from './page-signature.dto';

export class CreateSignatureDto {
  title: string;
  pages: PageSignatureDto[];
}
