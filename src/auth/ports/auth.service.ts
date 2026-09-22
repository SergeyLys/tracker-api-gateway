import { Injectable, Inject } from '@nestjs/common';
import { AUTH_SERVICE_PORT } from './auth-service.token';
import { AuthServicePort } from './auth-service.port';
import {
  AuthResult,
  GoogleLoginCommand,
  LoginCommand,
  RegisterCommand,
} from '../auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
  ) {}

  login(payload: LoginCommand): Promise<AuthResult> {
    return this.authService.login(payload);
  }

  register(payload: RegisterCommand): Promise<AuthResult> {
    return this.authService.register(payload);
  }

  loginWithGoogle(payload: GoogleLoginCommand): Promise<AuthResult> {
    return this.authService.loginWithGoogle(payload);
  }
}
