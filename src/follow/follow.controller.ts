import { Controller, Post, Req, UseGuards, Param, Delete, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserGuard } from 'src/user/user.guard';
import { Request } from 'express';
import {UserSearchDto} from "../user/user.search.dto";

@Controller('mate/search')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly userService: UserService,
  ) {}

  // [1] 팔로우
  @Post('/:followingId')
  @UseGuards(UserGuard)
  async createFollow(
      @Param('followingId') followingId : number,
      @Req() req: Request
  ): Promise<ResponseDto<any>> {
    // 현재 사용자 ID
    const userId = req.user.id;

    // 이미 팔로우하는 사용자인지 검증
    const user : UserEntity = await this.userService.findUserById(userId);
    const isAlreadyFollow = this.userService.checkIfFollowing(user, followingId);

    if (isAlreadyFollow) {
        return new ResponseDto(
            ResponseCode.IS_ALREADY_FOLLOW,
            false,
            "이미 팔로우하는 사용자입니다",
            null
        );
    }

    try {
        await this.followService.createFollow(userId, followingId);
        return new ResponseDto(
          ResponseCode.FOLLOW_CREATED,
          true,
          "팔로우 성공",
          null
        );
      } catch (error) {
        return new ResponseDto(
          ResponseCode.FOLLOW_CREATION_FAIL,
          false,
          "팔로우 실패",
          null
        );
      }
    }

  // [2] 언팔로우
  @Delete('/:followId')
  async deleteFollow(@Param('followId') followId: number, @Req() req: Request): Promise<ResponseDto<any>> {
    // 현재 사용자 ID
    // const userId = req.user.id;
    const userId = 1;

    try {
        const result = await this.followService.deleteFollow(followId);
        if (result) {
          return new ResponseDto(
            ResponseCode.UNFOLLOW_SUCCESS,
            true,
            "언팔로우 성공",
            null
          );
        } else {
          return new ResponseDto(
            ResponseCode.UNFOLLOW_FAIL,
            false,
            "언팔로우 실패",
            null
          );
        }
      } catch (error) {
        return new ResponseDto(
          ResponseCode.UNFOLLOW_FAIL,
          false,
          "언팔로우 실패",
          null
        );
      }
    }

    // [3] 팔로우 리스트 조회
    @Get('/followList')
    async getFollowList(): Promise<ResponseDto<any>> {
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        const userId = 1;

        try {
            const followList = await this.followService.getFollowList(userId);
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

    // [4] 팔로워 리스트 조회
    @Get('/followerList')
    async getFollowerList(): Promise<ResponseDto<any>> {
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        const userId = 1;

        try {
            const followerList = await this.followService.getFollowerList(userId);
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

    // [5] 메이트 검색
    @Get('/:searchTerm')
    async getSearchResult(
        @Req() req: Request,
        @Param('searchTerm') searchTerm: string): Promise<ResponseDto<any>> {
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        const userId = 1;

        try {
            const userSearchDto : UserSearchDto[] = await this.userService.getSearchResult(userId, searchTerm)
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