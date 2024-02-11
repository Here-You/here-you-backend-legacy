import {Injectable, HttpException, NotFoundException, BadRequestException} from '@nestjs/common';
import { UserFollowingEntity } from 'src/user/user.following.entity';
import { FollowDto } from './dto/follow.dto';
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { S3UtilService } from "../utils/S3.service";
import {SignatureEntity} from "../signature/domain/signature.entity";
import {Like} from "typeorm";
import {FollowSearchDto} from "./dto/follow.search.dto";

@Injectable()
export class FollowService {
    constructor(
        private readonly userService: UserService,
        private readonly s3Service: S3UtilService,
    ) {}

    // [1] 메이트 검색
    async getSearchResult(userId: number, searchTerm: string) {
        // 검색 결과에 해당하는 값 찾기
        // 해당 결과값을 name 혹은 nickName 에 포함하고 있는 사용자 찾기
        console.log('검색 값: ', searchTerm);
        const resultUsers = await UserEntity.find({
            where: [{ name: Like(`%${searchTerm}%`) }, { nickname: Like(`%${searchTerm}%`) }],
            relations: {profileImage : true, follower : true, following : true}
        });

        const userEntity = await UserEntity.findExistUser(userId);

        const searchResult = await Promise.all(resultUsers.map(async (user) => {
            const followSearchDto = new FollowSearchDto();

            console.log('현재의 유저 : ', user.id);
            followSearchDto.id = user.id;
            followSearchDto.nickName = user.nickname;
            followSearchDto.introduction = user.introduction;

            followSearchDto.followerCnt = user.follower.length;
            followSearchDto.followingCnt = user.following.length;

            // 팔로우 여부
            followSearchDto.isFollowing = await this.userService.checkIfFollowing(userEntity, followSearchDto.id);

            // 사용자 프로필 이미지
            const image = user.profileImage;
            if(image == null) followSearchDto.image = null;
            else{
                const userImageKey = image.imageKey;
                followSearchDto.image = await this.s3Service.getImageUrl(userImageKey);
            }
            return followSearchDto;
        }))
        return searchResult;
    }

    // [2] 팔로우 리스트 조회
    async getFollowList(userId: number): Promise<FollowDto[]> {
        // 현재 로그인한 사용자
        const user : UserEntity = await this.userService.findUserById(userId);
        console.log('현재 로그인한 사용자 : ',user.id);

        // 로그인한 사용자 = 팔로우하는 user
        const follows : UserFollowingEntity[] = await this.userService.getFollowingList(userId);

        // 팔로우 사용자들 정보 리스트
        const informs = await Promise.all(follows.map(async (follow) => {
            const followDto : FollowDto = new FollowDto();
            const mateEntity : UserEntity = follow.followUser;
            console.log('팔로우 사용자의 ID : ', mateEntity.id);

            followDto.nickName = mateEntity.nickname;
            followDto.mateId = mateEntity.id;
            followDto.email = mateEntity.email;
            followDto.introduction = mateEntity.introduction;
            followDto.isFollowing = !!follow.id;

            // 사용자 프로필 이미지
            const image = await this.userService.getProfileImage(mateEntity.id);
            if(image == null) followDto.image = null;
            else{
                const userImageKey = image.imageKey;
                followDto.image = await this.s3Service.getImageUrl(userImageKey);
            }

            return followDto;
        }));
        return informs;
    }

    // [3] 팔로워 리스트 조회
    async getFollowerList(userId: number): Promise<FollowDto[]> {
        // 현재 로그인한 사용자
        const user : UserEntity = await this.userService.findUserById(userId);
        console.log('현재 로그인한 사용자 : ',user.id);

        // 로그인한 사용자 = 팔로워
        const follows : UserFollowingEntity[] = await this.userService.getFollowerList(userId);

        // 팔로워 사용자들 정보 리스트
        const informs = await Promise.all(follows.map(async (follow) => {
            const followDto : FollowDto = new FollowDto();
            const mateEntity : UserEntity = follow.user;
            console.log('팔로워 사용자 ID : ', mateEntity.id);

            followDto.nickName = mateEntity.nickname;
            followDto.mateId = mateEntity.id;
            followDto.email = mateEntity.email;
            followDto.introduction = mateEntity.introduction;
            followDto.isFollowing = !!follow.id;

            // 사용자 프로필 이미지
            const image = await this.userService.getProfileImage(mateEntity.id);
            if(image == null) followDto.image = null;
            else{
                const userImageKey = image.imageKey;
                followDto.image = await this.s3Service.getImageUrl(userImageKey);
            }
            return followDto;
        }));

        return informs;
    }

    // 팔로우 가능한 사이인지 검증
    async checkFollow(userId : number, followingId : number): Promise<number> {
        try {
            // case1) 유효한 유저인지 검증
            const userEntity : UserEntity = await this.userService.findUserById(userId);
            const followingUser = await UserEntity.findExistUser(followingId);
            if (!followingUser) throw new NotFoundException('해당 사용자를 찾을 수 없습니다');
            console.log('현재 로그인한 유저 : ', userEntity);
            console.log('팔로우 대상 유저 : ', followingUser);

            // case2) 본인을 팔로우한 경우
            if (userId == followingId) throw new BadRequestException('본인을 팔로우 할 수 없습니다');

            // case3) 팔로우 관계 확인
            const isAlreadyFollowing = await this.userService.isAlreadyFollowing(userId, followingId);
            console.log('Is already following? : ', isAlreadyFollowing);

            // [2] 이미 팔로우 한 사이, 팔로우 취소
            if (isAlreadyFollowing) {
                console.log('언팔로우 service 호출');
                return this.deleteFollow(userId, followingId);
            } else {
                // [1] 팔로우
                console.log('팔로우 service 호출');
                return this.createFollow(userId, followingId);
            }
        } catch (e) {
            console.log('팔로우 요청에 실패하였습니다');
            throw new Error(e.message);
        }
    }

    // [4-1] 팔로우
    async createFollow(userId : number, followingId : number): Promise<number> {

        try {
            const userEntity : UserEntity = await this.userService.findUserById(userId);
            const followingUser = await UserEntity.findExistUser(followingId);
            if (!followingUser) throw new NotFoundException('해당 사용자를 찾을 수 없습니다');
            console.log('현재 로그인한 유저 : ', userEntity);
            console.log('팔로우 대상 유저 : ', followingUser);
            if (userId == followingId) throw new BadRequestException('본인을 팔로우 할 수 없습니다');

            const userFollowingEntity = new UserFollowingEntity();
            userFollowingEntity.user = userEntity;
            userFollowingEntity.followUser = followingUser;

            await userFollowingEntity.save();
            return userFollowingEntity.id;
        } catch (e) {
            console.log('팔로우 요청에 실패하였습니다');
            throw new Error(e.message);
        }
    }

    // [4-2] 언팔로우
    async deleteFollow(userId: number, followingId:number): Promise<number> {
        console.log('언팔로우 서비스 호출');
        const followEntity : UserFollowingEntity = await UserFollowingEntity.findOneOrFail({ where:
                { user : {id : userId}, followUser : {id : followingId}}
        });

        try{
            await followEntity.softRemove();
            return followEntity.id;
        }catch(e){
            console.error('언팔로우 요청에 실패하였습니다: ');
            throw new Error(e.message);
        }
    }


}
