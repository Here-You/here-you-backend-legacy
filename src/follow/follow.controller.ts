import {Controller, Post, Req, UseGuards, Param, Delete, Get, Patch} from '@nestjs/common';
import { FollowService } from './follow.service';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSearchDto} from "../user/user.search.dto";
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import {UserFollowingEntity} from "../user/user.following.entity";

@Controller('mate/search')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly userService: UserService,
  ) {}

  // [1] 팔로우
  @Patch('/:followingId')
  @UseGuards(UserGuard)
  async createFollow(@Req() req: Request, @Param('followingId') followingId : number): Promise<ResponseDto<any>> {

      try {
          const user: UserEntity = await this.userService.findUserById(req.user.id);
          console.log('현재 로그인한 사용자 : ', user.id);
          const following: UserEntity = await this.userService.findUserById(followingId);
          console.log('팔로우 대상 사용자 : ', following.id);

          // 팔로우 관계 확인
          const checkIfFollowing = this.userService.checkIfFollowing(user, followingId);
          console.log('checkIfFollowing : ', checkIfFollowing);

          // 이미 팔로우 한 사이, 언팔로우
          if (!checkIfFollowing) {
              console.log('언팔로우 service 호출');
              await this.followService.deleteFollow(req.user.id, followingId);
              return new ResponseDto(
                  ResponseCode.UNFOLLOW_SUCCESS,
                  true,
                  "언팔로우 성공",
                  null
              );
          } else {
              // 팔로우
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
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        // const userId = 1;

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

    // [4] 팔로워 리스트 조회
    @Get('/followerList')
    @UseGuards(UserGuard)
    async getFollowerList(@Req() req: Request): Promise<ResponseDto<any>> {
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        // const userId = 1;

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

    // [5] 메이트 검색
    @Get('/:searchTerm')
    @UseGuards(UserGuard)
    async getSearchResult(
        @Req() req: Request,
        @Param('searchTerm') searchTerm: string): Promise<ResponseDto<any>> {
        // 현재 로그인한 사용자 ID
        // const userId = req.user.id;
        // const userId = 1;

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