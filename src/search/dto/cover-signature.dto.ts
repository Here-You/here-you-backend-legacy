// cover-signature.dto.ts

export class CoverSignatureDto {
  _id: number;
  title: string;
  image: string;      // 시그니처 첫 번째 페이지 사진
  userName: string;   // 유저 닉네임
  userImage: string;  // 유저 프로필 사진
  date: string;
  liked: number;
}