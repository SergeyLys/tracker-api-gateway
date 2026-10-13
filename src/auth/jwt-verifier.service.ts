import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class JwtVerifierService {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(config: ConfigService) {
    const jwksUrl = config.getOrThrow<string>('JWT_JWKS_URL');

    this.issuer = config.getOrThrow<string>('JWT_ISSUER');
    this.audience = config.getOrThrow<string>('JWT_AUDIENCE');

    this.jwks = createRemoteJWKSet(new URL(jwksUrl));
  }

  async verify(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, this.jwks, {
      algorithms: ['RS256'],
      issuer: this.issuer,
      audience: this.audience,
    });

    if (typeof payload.sub !== 'string' || !payload.sub) {
      throw new Error('JWT must contain a subject');
    }

    return payload;
  }
}
