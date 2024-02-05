import { Controller, Post, Req, UseGuards, Param, Delete, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { FollowDto } from './dto/follow.dto';
// import { UserGuard } from 'src/user/user.guard';

// @UseGuards(UserGuard)
@Controller('mate/search')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
  ) {}

  // [1] 팔로우
  @Post('/:followingId')
  async createFollow(@Param('followingId') followingId : number): Promise<ResponseDto<any>> {
    // 현재 사용자 ID
    // const userId = req.user.id;
    const userId = 1;

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
  async deleteFollow(@Param('followId') followId: number): Promise<ResponseDto<any>> {
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
        // 현재 사용자 ID
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

}