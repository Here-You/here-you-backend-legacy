import { Injectable } from '@nestjs/common';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { DetailPageDto } from './dto/detail-page.dto';
import { DetailRuleDto } from './dto/detail-rule.dto';
import { DetailMemberDto } from './dto/detail-member.dto';
import { DetailCommentDto } from './dto/detail-comment.dto';
import { MetaToBackDto } from './dto/meta-to-back.dto';
import { RulePairDto } from './dto/rule-pair.dto';
import { MemberPairDto } from './dto/member-pair.dto';
import { UserProfileImageEntity } from 'src/user/user.profile.image.entity';
import { CommentEntity } from 'src/comment/domain/comment.entity';
import { CommentPairDto } from './dto/comment-pair.dto';
import { MetaToFrontDto } from './dto/meta-to-front.dto';

@Injectable()
export class RuleConverter {

    async toEntity(dto: CreateRuleDto, userId:number): Promise<{ main: RuleMainEntity, rules: RuleSubEntity[], invitations: RuleInvitationEntity[] }> {
        // main 저장
        const main = new RuleMainEntity();
        main.mainTitle = dto.mainTitle;

        //rule 저장
        const rules = dto.rulePairs.map(pair => {
            const sub = new RuleSubEntity();
            sub.ruleTitle = pair.ruleTitle;
            sub.ruleDetail = pair.ruleDetail;
            sub.main = main;
            return sub;
        });

        // invitation 저장
        const inviterEntity = await UserEntity.findOneOrFail({ where: { id: userId } });
        const invitations = await Promise.all(dto.invitedId.map(async invited => {
            const invitation = new RuleInvitationEntity();

            const invitedEntity = await UserEntity.findOneOrFail({ where: { id: invited } });
            invitation.rule = main;
            invitation.member = invitedEntity;
            invitation.inviter = inviterEntity;

            return invitation;
        }));

        return { main, rules, invitations };
    }

    async toDto(ruleId : number, metaToBackDto : MetaToBackDto): Promise<DetailPageDto> {

        const detailPageDto : DetailPageDto = new DetailPageDto();
        const detailRuleDto : DetailRuleDto = new DetailRuleDto();
        const detailMemberDto : DetailMemberDto = new DetailMemberDto();
        const detailCommentDto : DetailCommentDto = new DetailCommentDto();
        // const metaToFrontDto : MetaToFrontDto = new MetaToFrontDto();


        // DetailPageDto 에 넣어야 하는 정보
        // [1] DetailRuleDto
        const ruleMain : RuleMainEntity = await RuleMainEntity.findMainById(ruleId);
        const ruleSub : RuleSubEntity[] = ruleMain.rules;
        const comments : CommentEntity[] = ruleMain.comments;


        detailRuleDto.id = ruleMain.id;
        detailRuleDto.mainTitle = ruleMain.mainTitle;

        detailRuleDto.rulePairs = ruleSub.map(sub => {
            const rulePairDto: RulePairDto = new RulePairDto();
            rulePairDto.ruleTitle = sub.ruleTitle;
            rulePairDto.ruleDetail = sub.ruleDetail;
            return rulePairDto;
        });

        // [2] detailMemberDto
        const ruleInvitation : RuleInvitationEntity[] = ruleMain.members;
        detailMemberDto.memberPairs = await Promise.all(ruleInvitation.map(async (invitation) => {
            const memberPairDto: MemberPairDto = new MemberPairDto();
            const id = invitation.id;

            const { memberId, name} = await RuleInvitationEntity.findNameById(id);
            memberPairDto.memberId = memberId;
            memberPairDto.name = name;

            const userEntity : UserEntity = await UserEntity.findOne({ where: { id : memberId } });
            const imageKey = await UserProfileImageEntity.findImageKey(userEntity);
            memberPairDto.image = imageKey;

            return memberPairDto;

            // (수정) 멤버 3명 이상인 경우, 3명까지만 정보 넘기기
        }));

        // [3] detailCommentDto
        detailCommentDto.commentPairs = await Promise.all(comments.map(async (comment) => {
            const commentPairDto: CommentPairDto = new CommentPairDto();

            commentPairDto.id = comment.id;
            commentPairDto.text = comment.content;
            commentPairDto.created = comment.created;

            const userEntity : UserEntity = await UserEntity.findOne({ where: { id : comment.id } });
            const imageKey = await UserProfileImageEntity.findImageKey(userEntity);
            commentPairDto.image = imageKey;
            
            return commentPairDto;
        }));

        // [4] MetaBackDto


        return detailPageDto;
    }
}
