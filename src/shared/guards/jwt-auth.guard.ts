import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtVerifierService } from '../../auth/jwt-verifier.service';
import { errors as JoseErrors } from 'jose';

export interface AuthenticatedUser {
  sub: string;
  email?: string;
  roles?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtVerifier: JwtVerifierService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.cookies?.access_token;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await this.jwtVerifier.verify(token);

      request.user = {
        sub: payload.sub!,
        ...(typeof payload.email === 'string' ? { email: payload.email } : {}),
        ...(Array.isArray(payload.roles) &&
        payload.roles.every((role) => typeof role === 'string')
          ? { roles: payload.roles as string[] }
          : {}),
      };

      return true;
    } catch (error: unknown) {
      console.log('\n\n\n');
      console.log(error);
      console.log('\n\n\n');
      if (error instanceof JoseErrors.JWTExpired) {
        throw new UnauthorizedException({
          statusCode: 401,
          code: 'ACCESS_TOKEN_EXPIRED',
          message: 'Access token expired',
        });
      }

      if (
        error instanceof JoseErrors.JWTClaimValidationFailed ||
        error instanceof JoseErrors.JWSSignatureVerificationFailed ||
        error instanceof JoseErrors.JWSInvalid ||
        error instanceof JoseErrors.JWTInvalid
      ) {
        throw new UnauthorizedException('Invalid or expired access token');
      }

      throw error;
    }
  }
}
