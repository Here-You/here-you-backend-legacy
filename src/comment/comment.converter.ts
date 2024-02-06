import { Injectable } from '@nestjs/common';
import { CommentEntity } from './domain/comment.entity';
import { RuleMainEntity } from 'src/rule/domain/rule.main.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentConverter {

    async toEntity(dto: CreateCommentDto, ruleId:number): Promise<CommentEntity> {
        const comment = new CommentEntity();

        comment.content = dto.content;
        console.log(comment.content);
        const rule = await RuleMainEntity.findOneOrFail({ where: { id: ruleId } });
        comment.rule = rule;
        console.log(comment.rule);
        const user = await UserEntity.findOneOrFail({ where: { id: dto.userId } });
        comment.user = user;

        return comment;
    }
}