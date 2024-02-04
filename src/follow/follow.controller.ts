import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
// import { UserGuard } from 'src/user/user.guard';

// @UseGuards(UserGuard)
@Controller('mate/search')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
  ) {}

  // 팔로우
  @Post('/:followingId')
  async createFollow(@Param('followingId') followingId : number): Promise<ResponseDto<any>> {
    // 현재 사용자 ID
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
}