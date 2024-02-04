import { Injectable } from '@nestjs/common';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class RuleConverter {

    async toEntity(dto: CreateRuleDto): Promise<{ main: RuleMainEntity, rules: RuleSubEntity[], invitations: RuleInvitationEntity[] }> {
        const main = new RuleMainEntity();
        main.mainTitle = dto.mainTitle;

        const rules = dto.rulePairs.map(pair => {
            const sub = new RuleSubEntity();
            sub.ruleTitle = pair.ruleTitle;
            sub.ruleDetail = pair.ruleDetail;
            return sub;
        });

        const inviter = await UserEntity.findOneOrFail({ where: { id: dto.inviterId } });
        const rule = await RuleMainEntity.findOneOrFail({ where: { id: dto.inviterId } });
        const invitations = await Promise.all(dto.invitedId.map(async invitedId => {
            const invited = await UserEntity.findOneOrFail({ where: { id: invitedId } });

            const invitation = new RuleInvitationEntity();
            invitation.inviter = inviter;
            invitation.rule = rule;
            invitation.invited = invited;
            return invitation;
        }));

        return { main, rules, invitations };
    }
}
