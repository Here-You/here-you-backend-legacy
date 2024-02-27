// get-comment-writer.dto.ts

export class GetCommentWriterDto {
  _id: number;
  name: string;
  image: string; // 프로필 이미지
  is_writer: boolean; // 로그인 유저의 수정 삭제 가능 여부
}
