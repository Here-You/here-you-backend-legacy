// page-signature.dto.ts

export class PageSignatureDto {
  _id: number;
  page: number;
  content: string;
  location: string;
  //image: Buffer;  // form-data 형식
  image: string; // base-64 형식
}
