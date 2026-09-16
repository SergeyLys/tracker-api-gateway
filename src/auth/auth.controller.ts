import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonAuthTypes } from '@shared/types';

type LoginDto = CommonAuthTypes.LoginRequest;
type RegisterDto = CommonAuthTypes.RegisterRequest;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('/register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
}
