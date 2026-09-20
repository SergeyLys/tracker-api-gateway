import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const callbackPath =
      process.env.GOOGLE_CALLBACK_URL ?? '/auth/google/callback';
    const callbackURL = callbackPath.startsWith('http')
      ? callbackPath
      : `${process.env.GOOGLE_CALLBACK_BASE_URL ?? 'http://localhost:8081'}${callbackPath}`;

    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL,
      scope: ['openid', 'email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    return {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
    };
  }
}