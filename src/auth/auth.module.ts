import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthorizationServiceTypes } from '@shared/types';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AuthorizationServiceTypes.AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AuthorizationServiceTypes.protobufPackage,
          protoPath: join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'shared',
            'types',
            'src',
            'grpc',
            'authorization',
            'authorization-service.proto',
          ),
          loader: {
            includeDirs: [
              join(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'shared',
                'types',
                'src',
                'grpc',
              ),
            ],
          },
          url: process.env.AUTH_SERVICE_GRPC_URL,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
