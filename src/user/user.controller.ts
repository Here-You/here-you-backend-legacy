import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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

  @Post('/profile')
  @UseGuards(UserGuard)
  UpdateProfile(@Body() body: Partial<IUserProfile>, @Req() req: Request) {
    return this.userService.updateUserProfile(req.user.id, body);
  }
}
