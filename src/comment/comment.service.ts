import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './domain/comment.entity';
import {RuleMainEntity} from "../rule/domain/rule.main.entity";
import {UserEntity} from "../user/user.entity";

@Injectable()
export class CommentService {

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

  async updateComment(dto: CreateCommentDto, ruleId: number, userId: number, commentId: number) : Promise<number> {
    try {
      // 사용자, 규칙, 댓글 검증
      const user = await UserEntity.findExistUser(userId);
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
      const rule = await RuleMainEntity.findRuleById(ruleId);
      if (!rule) throw new NotFoundException('존재하지 않는 규칙입니다');

      const comment = await CommentEntity.findOne({
        where: {user: {id: userId}, rule: {id: ruleId}}
      })
      if(!comment) throw new NotFoundException("데이터를 찾을 수 없습니다");

      if(comment.id != commentId) throw new NotFoundException('해당 댓글 수정 권한이 없는 사용자입니다');

      if (comment.id == commentId) {
        comment.content = dto.content;
        await CommentEntity.save(comment);
        return comment.id;
      }
    } catch (e) {
      console.log('해당 댓글 수정 권한이 없는 사용자 입니다');
      throw new Error(e.message);
    }
  }

  async deleteComment(ruleId: number, userId: number, commentId: number) : Promise<number> {
    try {
      // 사용자, 규칙, 댓글 검증
      const user = await UserEntity.findExistUser(userId);
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
      const rule = await RuleMainEntity.findRuleById(ruleId);
      if (!rule) throw new NotFoundException('존재하지 않는 규칙입니다');

      const comment = await CommentEntity.findOne({
        where: {user: {id: userId}, rule: {id: ruleId}}
      })
      if (!comment) throw new NotFoundException("데이터를 찾을 수 없습니다");

      if (comment.id != commentId) throw new NotFoundException('해당 댓글을 작성한 사용자가 아닙니다');

      if (comment.id == commentId) {
        await comment.softRemove();
        return comment.id;
      }
    } catch (e) {
      console.log('해당 댓글 삭제 권한이 없는 사용자 입니다');
      throw new Error(e.message);
    }
  }
}
