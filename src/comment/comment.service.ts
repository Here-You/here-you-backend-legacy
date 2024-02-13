import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './domain/comment.entity';
import {RuleMainEntity} from "../rule/domain/rule.main.entity";
import {UserEntity} from "../user/user.entity";

@Injectable()
export class CommentService {

  // [1] 댓글 작성
  async createComment(dto: CreateCommentDto, ruleId: number, userId: number): Promise<number> {

    const comment = new CommentEntity();

    const user = await UserEntity.findOneOrFail({ where: { id: userId } });
    const rule = await RuleMainEntity.findOneOrFail({ where: { id: ruleId } });

    if(!user || !rule){
      throw new Error('Data not found');
    }
    else{
      console.log("user name: "+ user.name);
      comment.user = user;
      console.log("rule id: "+ rule.id);
      comment.rule = rule;
      comment.content = dto.content;
      await comment.save();
    }
    return comment.id;
  }

  // [2] 댓글 수정
  async updateComment(dto: CreateCommentDto, ruleId: number, userId: number, commentId: number) : Promise<number> {
    try {
      // 사용자, 규칙, 댓글 검증
      const user = await UserEntity.findOne({
        where: {id : userId},
      });
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
      const rule = await RuleMainEntity.findOne({
        where: {id: ruleId},
      })
      if (!rule) throw new NotFoundException('존재하지 않는 규칙입니다');
      const comment = await CommentEntity.findOne({
        where: {id: commentId}
      });
      if (!comment) throw new NotFoundException('존재하지 않는 댓글 입니다');

      const checkValidateUser = await CommentEntity.findOne({
        where: {id: commentId, user: {id: userId}, rule: {id: ruleId}}}
      )
      if (!!checkValidateUser) {
        comment.content = dto.content;
        await CommentEntity.save(comment);
        return comment.id;
      } else {
        throw new NotFoundException('해당 댓글 수정 권한이 없는 사용자 입니다');
      }
    } catch (e) {
      console.log('검증 과정에서 에러 발생');
      throw new Error(e.message);
    }
  }

  // [3] 댓글 삭제
  async deleteComment(ruleId: number, userId: number, commentId: number) : Promise<number> {
    try {
      // 사용자, 규칙, 댓글 검증
      const user = await UserEntity.findOne({
        where: {id : userId},
      });
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
      const rule = await RuleMainEntity.findOne({
        where: {id: ruleId},
      })
      if (!rule) throw new NotFoundException('존재하지 않는 규칙입니다');
      const comment = await CommentEntity.findOne({
        where: {id: commentId}
      });
      if (!comment) throw new NotFoundException('존재하지 않는 댓글 입니다');

      // 해당 규칙에, 해당 사용자가 작성한, 해당 댓글 ID를 가진 댓글이 있는지 검증
      const checkValidateUser = await CommentEntity.findOne({
        where: {id: commentId, user: {id: userId}, rule: {id: ruleId}}}
      )
      if (!!checkValidateUser) {
        await comment.softRemove();
        console.log('댓글 삭제 성공');
        return comment.id;
      } else {
        throw new NotFoundException('해당 댓글 삭제 권한이 없는 사용자 입니다');
      }
    } catch (e) {
      console.log('검증 과정에서 에러 발생');
      throw new Error(e.message);
    }
  }
}
