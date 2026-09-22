import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GoogleAuthRequest,
  LoginCommand,
  RegisterCommand,
} from '../../../auth.types';
import { Response } from 'express';
import { AuthService } from '../../../ports/auth.service';

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
  async googleCallback(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    try {
      const result = await this.authService.loginWithGoogle(req.user);

      this.setAccessTokenCookie(res, result.accessToken);

      return res.redirect('http://localhost:3000/dashboard');
    } catch (error) {
      console.error(error);

      return res.redirect('http://localhost:3000/login');
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() payload: LoginCommand) {
    const result = await this.authService.login(payload);

    this.setAccessTokenCookie(res, result.accessToken);

    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('register')
  async register(@Res() res: Response, @Body() payload: RegisterCommand) {
    const result = await this.authService.register(payload);

    this.setAccessTokenCookie(res, result.accessToken);

    return res.redirect('http://localhost:3000/dashboard');
  }
}
