import { CommonAuthTypes } from "@SergeyLys/tracker-contracts";

export type GoogleLoginCommand = CommonAuthTypes.LoginRequest;
export type LoginCommand = CommonAuthTypes.LoginRequest;
export type RegisterCommand = CommonAuthTypes.RegisterRequest;

export interface AuthResult {
  accessToken: string;
}

export interface GoogleAuthRequest extends Request {
  user: {
    email: string;
    provider: string;
    providerId: string;
  };
}