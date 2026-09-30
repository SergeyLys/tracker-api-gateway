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
  AuthResult,
  GoogleAuthRequest,
  LoginCommand,
  RegisterCommand,
} from '../../../auth.types';
import { Request, Response } from 'express';
import { AuthService } from '../../../ports/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setCookieHeaders(res: Response, tokens: AuthResult) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: 'lax',
    });
    res.cookie('refresh_token', tokens.refreshToken, {
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

      this.setCookieHeaders(res, result);

      return res.redirect('http://localhost:3000/dashboard');
    } catch (error) {
      return res.redirect('http://localhost:3000/login');
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() payload: LoginCommand) {
    const result = await this.authService.login(payload);

    this.setCookieHeaders(res, result);

    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('register')
  async register(@Res() res: Response, @Body() payload: RegisterCommand) {
    const result = await this.authService.register(payload);

    this.setCookieHeaders(res, result);

    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refresh({
      currentRefreshToken: req.cookies.refresh_token,
    });

    this.setCookieHeaders(res, result);

    return res.json({ status: 'ok' });
  }
}
