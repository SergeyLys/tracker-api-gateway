import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
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

    return lastValueFrom(this.authClient.login(schema));
  }

  async register(payload: RegisterCommand): Promise<AuthResult> {
    const schema = Schemas.RegisterRequestSchema.parse(payload);

    return lastValueFrom(this.authClient.register(schema));
  }

  async loginWithGoogle(payload: GoogleLoginCommand): Promise<AuthResult> {
    const schema = Schemas.LoginRequestSchema.parse(payload);

    return lastValueFrom(this.authClient.loginWithGoogle(schema));
  }
}
