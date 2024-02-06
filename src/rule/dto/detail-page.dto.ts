import { DetailRuleDto } from './detail-rule.dto';
import { DetailMemberDto } from './detail-member.dto';
import { DetailCommentDto } from './detail-comment.dto';
import { MetaToBackDto } from './meta-to-back.dto';


export class DetailPageDto {
  rule: DetailRuleDto; 
  member: DetailMemberDto;
  comment: DetailCommentDto[];
  // metaBack: MetaToBackDto;
}