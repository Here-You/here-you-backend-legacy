import { Injectable, HttpException } from '@nestjs/common';
import { UserFollowingEntity } from 'src/user/user.following.entity';
import { FollowListConverter } from './follow.list.converter';
import { FollowerListConverter } from './follower.list.converter';
import { FollowDto } from './dto/follow.dto';
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class FollowService {
    constructor(
        private readonly followListConverter: FollowListConverter,
        private readonly followerListConverter: FollowerListConverter,
        private readonly userService: UserService,
    ) {}

    // [1] 팔로우
    async createFollow(userId : number, followingId : number): Promise<UserFollowingEntity> {

        const userEntity : UserEntity = await this.userService.findUserById(userId);
        const followingUserEntity : UserEntity = await this.userService.findUserById(followingId);
        console.log('현재 로그인한 유저 : ', userEntity);
        console.log('팔로우 대상 유저 : ', followingUserEntity);

        try{
            const userFollowingEntity = new UserFollowingEntity();
            userFollowingEntity.user = userEntity;
            userFollowingEntity.followUser = followingUserEntity;

            return userFollowingEntity.save();

        }catch(error){
            console.error('Error on following: ', error);
            throw new Error('Failed to following');
        }
    }

    // [2] 언팔로우
    async deleteFollow(userId: number, followingId:number): Promise<UserFollowingEntity> {
        console.log('언팔로우 서비스 호출');
        const followEntity : UserFollowingEntity = await UserFollowingEntity.findOneOrFail({ where:
                { user : {id : userId}, followUser : {id : followingId}}
        });

        try{
            return followEntity.softRemove();
        }catch(error){
            console.error('Error on unfollowing: ', error);
            throw new Error('Failed to unfollowing');
        }
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
