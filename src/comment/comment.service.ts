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

  /*
  async updateComment(dto: CreateCommentDto, ruleId: number, userId: number) : Promise<number> {

  }
  */
}
