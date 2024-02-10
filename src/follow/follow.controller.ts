import {Controller, Post, Req, UseGuards, Param, Delete, Get, Patch, Query} from '@nestjs/common';
import { FollowService } from './follow.service';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSearchDto} from "../user/user.search.dto";
import { UserGuard } from '../user/user.guard';
import {query, Request} from 'express';
import {UserFollowingEntity} from "../user/user.following.entity";
import * as querystring from "querystring";

@Controller('mate/search')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly userService: UserService,
  ) {}

    // [1] 팔로우
    @Patch('/follow/:followingId')
    @UseGuards(UserGuard)
    async createFollow(@Req() req: Request, @Param('followingId') followingId : number): Promise<ResponseDto<any>> {

        try {
            // 팔로우 관계 확인
            const isAlreadyFollowing = await this.userService.isAlreadyFollowing(req.user.id, followingId);
            console.log('Is already following? : ', isAlreadyFollowing);

            // -1) 이미 팔로우 한 사이, 팔로우 취소
            if (isAlreadyFollowing) {
                console.log('언팔로우 service 호출');
                await this.followService.deleteFollow(req.user.id, followingId);
                return new ResponseDto(
                    ResponseCode.UNFOLLOW_SUCCESS,
                    true,
                    "언팔로우 성공",
                    null
                );
            } else {
                // -2) 팔로우
                console.log('팔로우 service 호출');
                await this.followService.createFollow(req.user.id, followingId);
                return new ResponseDto(
                    ResponseCode.FOLLOW_CREATED,
                    true,
                    "팔로우 성공",
                    null
                );
            }
        } catch(error) {
            return new ResponseDto(
                ResponseCode.UNFOLLOW_FAIL,
                false,
                "처리 실패",
                null
            );
        }
    }

    // [2] 팔로우 리스트 조회
    @Get('/followList')
    @UseGuards(UserGuard)
    async getFollowList(@Req() req: Request): Promise<ResponseDto<any>> {
        try {
            const followList = await this.followService.getFollowList(req.user.id);
            return new ResponseDto(
            ResponseCode.GET_FOLLOWING_LIST_SUCCESS,
            true,
            "팔로우 리스트 불러오기 성공",
            followList
            );
        } catch (error) {
            return new ResponseDto(
                ResponseCode.GET_FOLLOWING_LIST_FAIL,
                false,
                "팔로우 리스트 불러오기 실패",
                null
            );
        }
    }

    // [3] 팔로워 리스트 조회
    @Get('/followerList')
    @UseGuards(UserGuard)
    async getFollowerList(@Req() req: Request): Promise<ResponseDto<any>> {
        try {
            const followerList = await this.followService.getFollowerList(req.user.id);
            return new ResponseDto(
            ResponseCode.GET_FOLLOWER_LIST_SUCCESS,
            true,
            "팔로워 리스트 불러오기 성공",
            followerList
            );
        } catch (error) {
            return new ResponseDto(
                ResponseCode.GET_FOLLOWER_LIST_FAIL,
                false,
                "팔로워 리스트 불러오기 실패",
                null
            );
        }
    }

    // [4] 메이트 검색
    @Get('/search')
    @UseGuards(UserGuard)
    async getSearchResult(
        @Query('searchTerm')searchTerm : string,
        @Req() req: Request): Promise<ResponseDto<any>> {
        try {
            const userSearchDto : UserSearchDto[] = await this.userService.getSearchResult(req.user.id, searchTerm)
            return new ResponseDto(
                ResponseCode.GET_SEARCH_RESULT_SUCCESS,
                true,
                "검색 결과 리스트 불러오기 성공",
                userSearchDto
            );
        } catch (error) {
            return new ResponseDto(
                ResponseCode.GET_SEARCH_RESULT_FAIL,
                false,
                "검색 결과 리스트 불러오기 실패",
                null
            );
        }
    }
}