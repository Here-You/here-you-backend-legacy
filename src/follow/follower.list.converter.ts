import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserFollowingEntity } from 'src/user/user.following.entity';
import { FollowDto } from './dto/follow.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FollowerListConverter {

    constructor(private readonly userService: UserService) {}

    async toDto(userId: number): Promise<FollowDto[]> {

        // 현재 로그인한 사용자
        const user : UserEntity = await this.userService.findUserById(userId);
        console.log('현재 로그인한 사용자 : ', user);

        // 로그인한 사용자의 팔로워 리스트
        const followers : UserFollowingEntity[] = await this.userService.getFollowerList(userId);
        console.log('followers : ', followers);

        // 팔로워 사용자들 정보 리스트
        const informs = await Promise.all(followers.map(async (follower) => {
            const followerDto : FollowDto = new FollowDto();
            const mateEntity : UserEntity = follower.user;

            followerDto.nickName = mateEntity.nickname;
            followerDto.mateId = mateEntity.id;
            followerDto.email = mateEntity.email;
            followerDto.introduction = mateEntity.introduction;
            followerDto.followId = follower.id; // 팔로우 테이블 ID (null인 경우 팔로우 버튼 표시)
            const image = await this.userService.getProfileImage(mateEntity.id);
            followerDto.image = image.imageKey;

            return followerDto;
        }))
        
        return informs;
    }
}