import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  Login(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.Login(email, password);
  }
}
