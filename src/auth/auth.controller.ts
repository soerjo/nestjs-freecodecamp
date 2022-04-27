import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthReqDto, LoginReqDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() authReq: AuthReqDto) {
    return this.authService.signup(authReq);
  }

  @Post('login')
  login(@Body() loginDto: LoginReqDto) {
    return this.authService.login(loginDto);
  }
}
