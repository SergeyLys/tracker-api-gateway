import {
  LoginCommand,
  AuthResult,
  RegisterCommand,
  GoogleLoginCommand,
} from '../auth.types';

export interface AuthServicePort {
  login(payload: LoginCommand): Promise<AuthResult>;

  register(payload: RegisterCommand): Promise<AuthResult>;

  loginWithGoogle(payload: GoogleLoginCommand): Promise<AuthResult>;
}
