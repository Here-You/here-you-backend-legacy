// get-signature-comment.dto.ts

import { GetCommentWriterDto } from './get-comment-writer.dto';

export class GetSignatureCommentDto{
  _id: number;
  parentId: number;
  content: string;
  writer: GetCommentWriterDto;
  date: Date;           // 생성 | 수정일
  is_edited: boolean;   // 댓글 수정 여부
  can_delete: boolean;  // 로그인한 사용자의 댓글 삭제 권한 여부: 시그니처 작성자면 true
}