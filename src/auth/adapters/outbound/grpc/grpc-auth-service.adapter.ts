import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  AuthorizationServiceTypes,
  Schemas,
} from '@SergeyLys/tracker-contracts';
import { lastValueFrom } from 'rxjs';
import { AuthServicePort } from '../../../ports/auth-service.port';
import {
  LoginCommand,
  AuthResult,
  RegisterCommand,
  GoogleLoginCommand,
  RefreshTokenCommand,
} from '../../../auth.types';

type AuthServiceClient = AuthorizationServiceTypes.AuthServiceClient;

@Injectable()
export class GrpcAuthServiceAdapter implements AuthServicePort {
  private authClient!: AuthServiceClient;

  constructor(
    @Inject(AuthorizationServiceTypes.AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authClient = this.client.getService<AuthServiceClient>(
      AuthorizationServiceTypes.AUTH_SERVICE_NAME,
    );
  }

  async login(payload: LoginCommand): Promise<AuthResult> {
    const schema = Schemas.LoginRequestSchema.parse({
      ...payload,
      provider: 'password',
    });

    return new Promise<AuthResult>((resolve, reject) => {
      this.authClient.login(schema).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(new RpcException(err)),
      });
    });
  }

  async register(payload: RegisterCommand): Promise<AuthResult> {
    const schema = Schemas.RegisterRequestSchema.parse(payload);

    return new Promise<AuthResult>((resolve, reject) => {
      this.authClient.register(schema).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(new RpcException(err)),
      });
    });
  }

  async loginWithGoogle(payload: GoogleLoginCommand): Promise<AuthResult> {
    const schema = Schemas.LoginRequestSchema.parse(payload);

    return new Promise<AuthResult>((resolve, reject) => {
      this.authClient.loginWithGoogle(schema).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(new RpcException(err)),
      });
    });
  }

  async refresh(payload: RefreshTokenCommand) {
    console.log(payload);
    const schema = Schemas.RefreshTokenRequestSchema.parse(payload);

    return new Promise<AuthResult>((resolve, reject) => {
      this.authClient.refresh(schema).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(new RpcException(err)),
      });
    });
  }
}
