// home-signature.dto.ts

export class HomeSignatureDto {
  _id: number;     // 시그니처 id
  title: string;  // 시그니처 제목
  date: Date;     // 시그니처 발행일
  image: string;  // 시그니처 첫번째 페이지의 이미지(썸네일)
}
