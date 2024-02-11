import {Controller, Post, Req, UseGuards, Param, Delete, Get, Patch, Query} from '@nestjs/common';
import { FollowService } from './follow.service';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserService } from 'src/user/user.service';
import { UserGuard } from '../user/user.guard';
import {query, Request} from 'express';
import { FollowSearchDto } from "./dto/follow.search.dto";

@Controller('mate/follow')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly userService: UserService,
  ) {}

    // [1] 메이트 검색
    @Get('/search')
    @UseGuards(UserGuard)
    async getSearchResult(
        @Query('searchTerm')searchTerm : string,
        @Req() req: Request): Promise<ResponseDto<any>> {
        try {
            const followSearchDto : FollowSearchDto[] = await this.followService.getSearchResult(req.user.id, searchTerm)
            return new ResponseDto(
                ResponseCode.GET_SEARCH_RESULT_SUCCESS,
                true,
                "검색 결과 리스트 불러오기 성공",
                followSearchDto
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

    // [2] 팔로워 리스트 조회
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
        } catch (e) {
            return new ResponseDto(
                ResponseCode.GET_FOLLOWER_LIST_FAIL,
                false,
                e.message,
                null
            );
        }
    }

    // [3] 팔로우 리스트 조회
    @Get('/followList')
    @UseGuards(UserGuard)
    async getFollowList(@Req() req: Request): Promise<ResponseDto<any>> {
        console.log('controller');
        try {
            const followList = await this.followService.getFollowList(req.user.id);
            return new ResponseDto(
                ResponseCode.GET_FOLLOWING_LIST_SUCCESS,
                true,
                "팔로우 리스트 불러오기 성공",
                followList
            );
        } catch (e) {
            return new ResponseDto(
                ResponseCode.GET_FOLLOWING_LIST_FAIL,
                false,
                e.message,
                null
            );
        }
    }

    // [4] 팔로우
    @Patch('/:followingId')
    @UseGuards(UserGuard)
    async createFollow(@Req() req: Request, @Param('followingId') followingId : number): Promise<ResponseDto<any>> {
        try {
            const result = await this.followService.checkFollow(req.user.id, followingId);
            return new ResponseDto(
                ResponseCode.FOLLOW_SUCCESS,
                true,
                "팔로우 / 언팔로우 성공",
                result
            );
        } catch (e) {
            return new ResponseDto(
                ResponseCode.FOLLOW_FAIL,
                false,
                e.message,
                null
            );
        }
    }
}