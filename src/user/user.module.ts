import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserServiceTypes } from '@SergeyLys/tracker-contracts';
import { protoPath } from '@SergeyLys/tracker-contracts/paths';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: UserServiceTypes.USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: UserServiceTypes.protobufPackage,
          url: process.env.USER_SERVICE_GRPC_URL,
          protoPath: join(protoPath, 'user', 'user-service.proto'),
          loader: {
            includeDirs: [protoPath],
          },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
