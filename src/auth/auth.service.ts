import { Injectable, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { AuthorizationServiceTypes } from '@shared/types';
import { CommonAuthTypes } from '@shared/types';
import { lastValueFrom } from 'rxjs';

type LoginDto = CommonAuthTypes.LoginRequest;
type RegisterDto = CommonAuthTypes.RegisterRequest;

type AuthServiceClient = AuthorizationServiceTypes.AuthServiceClient;

@Injectable()
export class AuthService {
  private authClient: AuthServiceClient = {} as AuthServiceClient;

  constructor(
    @Inject(AuthorizationServiceTypes.AUTH_SERVICE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authClient = this.client.getService<AuthServiceClient>(
      AuthorizationServiceTypes.AUTH_SERVICE_NAME,
    );
  }

  async login(payload: LoginDto) {
    const result = await lastValueFrom(this.authClient.login(payload));

    return result;
  }

  async register(payload: RegisterDto) {
    const result = await lastValueFrom(this.authClient.register(payload));
    return result;
  }
}
