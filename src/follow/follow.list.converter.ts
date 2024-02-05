import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserProfileImageEntity } from 'src/user/user.profile.image.entity';
import { UserFollowingEntity } from 'src/user/user.following.entity';
import { FollowDto } from './dto/follow.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class FollowListConverter {

    constructor(private readonly userService: UserService) {}

    async toDto(userId: number): Promise<FollowDto[]> {

        // 현재 로그인한 사용자
        const user : UserEntity = await this.userService.findUserById(userId);
        console.log('현재 로그인한 사용자 : ',user);

        // 로그인한 사용자의 팔로우 리스트
        const followings : UserFollowingEntity[] = await this.userService.getFollowingList(userId);
        console.log('followings : ',followings);

        // 팔로우 사용자들 정보 리스트
        const informs = await Promise.all(followings.map(async (following) => {
            const followDto : FollowDto = new FollowDto();
            const mateEntity : UserEntity = following.user;

            followDto.mateId = mateEntity.id;
            followDto.nickName = mateEntity.nickname;
            followDto.email = mateEntity.email;
            followDto.introduction = mateEntity.introduction;

            followDto.followId = following.id; // 팔로우 테이블 ID
            const image = await this.userService.getProfileImage(mateEntity.id);
            followDto.image = image.imageKey;

            return followDto;
        }))

        console.log(informs);
        
        return informs;
    }
}