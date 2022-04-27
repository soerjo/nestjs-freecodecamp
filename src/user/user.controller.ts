import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import { JwtGuard } from 'src/common/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // must gave jwt access_token to this point
  @UseGuards(JwtGuard)
  @Get()
  getMe(@GetUser('email') email: string) {
    return { email };
  }
}
