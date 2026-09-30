import { CommonAuthTypes } from '@SergeyLys/tracker-contracts';

export type GoogleLoginCommand = CommonAuthTypes.LoginRequest;
export type LoginCommand = CommonAuthTypes.LoginRequest;
export type RegisterCommand = CommonAuthTypes.RegisterRequest;
export type RefreshTokenCommand = CommonAuthTypes.RefreshTokenRequest;

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest extends Request {
  user: {
    email: string;
    provider: string;
    providerId: string;
  };
}
