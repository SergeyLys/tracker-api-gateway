import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonAuthTypes,  } from '@SergeyLys/tracker-contracts';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

type LoginDto = CommonAuthTypes.LoginRequest;
type RegisterDto = CommonAuthTypes.RegisterRequest;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAccessTokenCookie(res: Response, accessToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: 'lax',
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request & { user: { email: string } }, @Res() res: Response) {
    const user = {
      email: req.user?.email,
      provider: 'google',
    };
    console.log(req.user);
    const result = await this.authService.loginWithGoogle(user);

    this.setAccessTokenCookie(res, result.accessToken);

    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('/login')
  async login(
    @Res() res: Response, 
    @Body() payload: LoginDto
  ) {
    const result = await this.authService.login(payload);

    this.setAccessTokenCookie(res, result.accessToken);

    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('/register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
}
