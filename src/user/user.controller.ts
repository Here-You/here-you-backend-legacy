import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserProfile } from './user.dto';
import { UserGuard } from './user.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  Login(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.Login(email, password);
  }

  @Post('/login/oauth')
  SNSLogin(
    @Body('type') type: 'KAKAO' | 'GOOGLE',
    @Body('token') token: string,
    @Body('redirect_uri') redirectUrl: string,
  ) {
    return this.userService.SNSLogin(type, token, redirectUrl);
  }

  @Post('/profile')
  @UseGuards(UserGuard)
  UpdateProfile(@Body() body: Partial<IUserProfile>, @Req() req: Request) {
    return this.userService.updateUserProfile(req.user.id, body);
  }

  @Post('/profile/nickname')
  @UseGuards(UserGuard)
  UpdateNickname(@Body('nickname') nickname: string, @Req() req: Request) {
    return this.userService.updateUserProfile(req.user.id, { nickname });
  }

  @Post('/profile/intro')
  @UseGuards(UserGuard)
  UpdateIntroduction(@Body('intro') introduction: string, @Req() req: Request) {
    return this.userService.updateUserProfile(req.user.id, { introduction });
  }

  @Post('/profile/visibility')
  @UseGuards(UserGuard)
  UpdateUserVisibility(
    @Body('visibility') visibility: 'PRIVATE' | 'PUBLIC' | 'MATE',
    @Req() req: Request,
  ) {
    return this.userService.updateUserVisibility(req.user.id, visibility);
  }

  @Delete('/profile/delete')
  @UseGuards(UserGuard)
  DeleteAccount(@Req() req: Request) {
    return this.userService.deleteAccount(req.user.id);
  }

  @Get('/diaries')
  @UseGuards(UserGuard)
  ListDiaries(@Req() req: Request, @Query('cursor') cursor: string) {
    return this.userService.listDiaries(req.user.id, cursor);
  }
}
