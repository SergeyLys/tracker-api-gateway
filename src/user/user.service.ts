import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceTypes } from '@SergeyLys/tracker-contracts';

type UserServiceClient = UserServiceTypes.UserServiceClient;

@Injectable()
export class UserService {
  private userClient!: UserServiceClient;

  constructor(
    @Inject(UserServiceTypes.USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(
      UserServiceTypes.USER_SERVICE_NAME,
    );
  }

  async getCurrenSessionUser() {
    return {
      status: 'ok',
    };
  }
}
