import { Injectable, HttpException } from '@nestjs/common';
import { UserFollowingEntity } from 'src/user/user.following.entity';
import { FollowListConverter } from './follow.list.converter';
import { FollowerListConverter } from './follower.list.converter';
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
    constructor(
        private followListConverter: FollowListConverter,
        private followerListConverter: FollowerListConverter,
    ) {}

    // [1] 팔로우
    async createFollow(userId : number, followingId : number): Promise<UserFollowingEntity> {
        const follow = UserFollowingEntity.create({
            user: { id : userId },
            followUser: { id : followingId },
        });
        return follow.save();
    }

    // [2] 언팔로우
    async deleteFollow(followId:number): Promise<UserFollowingEntity> {
        const followEntity : UserFollowingEntity = await UserFollowingEntity.findOne({ where: { id : followId }});

        return followEntity.softRemove();
    }

    // [3] 팔로우 리스트 조회
    async getFollowList(userId: number): Promise<FollowDto[]> {
        const followDto: FollowDto[] = await this.followListConverter.toDto(userId);

        return followDto;
    }

    // [4] 팔로워 리스트 조회
    async getFollowerList(userId: number): Promise<FollowDto[]> {
        const followerDto: FollowDto[] = await this.followerListConverter.toDto(userId);

        return followerDto;
    }
}
