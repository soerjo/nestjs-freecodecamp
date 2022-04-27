import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthReqDto, LoginReqDto } from './dto';

import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(authReqDto: AuthReqDto) {
    const { email, password } = authReqDto;
    const hash = await argon.hash(password);
    let user: User;

    try {
      user = await this.prismaService.user.create({ data: { email, hash } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new BadRequestException(
          `user with email ${email} has been registed, please take an other email`,
        );

      throw new InternalServerErrorException('some think error');
    }

    delete user.hash;
    return user;
  }

  async login(loginDto: LoginReqDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user)
      if (!(await argon.verify(user.hash, password)))
        throw new ForbiddenException('not authencited');

    return this.signJwt(user.id, user.email);
  }

  signJwt(userId: string, email: string) {
    const payload = { userId, email };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_KEY'),
      expiresIn: '1m',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_KEY'),
      expiresIn: '1h',
    });

    return { access_token, refresh_token };
  }
}
