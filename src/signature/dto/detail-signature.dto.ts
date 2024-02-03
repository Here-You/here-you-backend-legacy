// detail-signature.dto.ts

import { AuthorSignatureDto } from './author-signature.dto';
import { HeaderSignatureDto } from './header-signature.dto';
import { PageSignatureDto } from './page-signature.dto';

export class DetailSignatureDto { // 시그니처 상세 보기
  author: AuthorSignatureDto;   // 시그니처 작성자 정보
  header: HeaderSignatureDto;   // 시그니처 제목 및 좋아요 정보
  pages: PageSignatureDto[];      // 시그니처 각 페이지 내용
}