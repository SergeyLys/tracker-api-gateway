import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthorizationServiceTypes } from '@SergeyLys/tracker-contracts';
import { protoPath } from '@SergeyLys/tracker-contracts/paths';
import { join } from 'path';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: AuthorizationServiceTypes.AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AuthorizationServiceTypes.protobufPackage,
          protoPath: join(
            protoPath,
            'authorization',
            'authorization-service.proto',
          ),
          loader: {
            includeDirs: [protoPath],
          },
          url: process.env.AUTH_SERVICE_GRPC_URL,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
