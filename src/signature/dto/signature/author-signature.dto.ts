// author-signature.dto.ts

export class AuthorSignatureDto { // 시그니처 작성자 정보
  _id: number;           // 메이트 아이디
  name: string;         // 메이트 닉네임
  image: string;        // 메이트 프로필 이미지
  is_followed: boolean; // 해당 메이트 팔로우 여부
}