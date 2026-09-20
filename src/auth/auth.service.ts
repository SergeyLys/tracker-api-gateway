import { Injectable, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  AuthorizationServiceTypes,
  Schemas,
  CommonAuthTypes
} from '@SergeyLys/tracker-contracts';
import { lastValueFrom } from 'rxjs';

type LoginDto = Schemas.LoginRequest;
type RegisterDto = Schemas.RegisterRequest;

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

  async loginWithGoogle(googleUser: LoginDto): Promise<CommonAuthTypes.AuthResponse> {
    const schema = Schemas.LoginRequestSchema.parse(googleUser);
    const result = await lastValueFrom(this.authClient.loginWithGoogle(schema));

    return result;
  }

  async login(payload: LoginDto): Promise<CommonAuthTypes.AuthResponse> {
    const schema = Schemas.LoginRequestSchema.parse({...payload, provider: 'password'});
    const result = await lastValueFrom(this.authClient.login(schema));

    return result;
  }

  async register(payload: RegisterDto): Promise<CommonAuthTypes.AuthResponse> {
    const schema = Schemas.RegisterRequestSchema.parse(payload);
    const result = await lastValueFrom(this.authClient.register(schema));
    return result;
  }
}
