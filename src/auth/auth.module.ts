import { Module } from '@nestjs/common';
import { AuthController } from './adapters/inbound/http/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthorizationServiceTypes } from '@SergeyLys/tracker-contracts';
import { protoPath } from '@SergeyLys/tracker-contracts/paths';
import { join } from 'path';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './ports/auth.service';
import { GrpcAuthServiceAdapter } from './adapters/outbound/grpc/grpc-auth-service.adapter';
import { AUTH_SERVICE_PORT } from './ports/auth-service.token';
import { JwtVerifierService } from './jwt-verifier.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

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
  providers: [
    GoogleStrategy,
    AuthService,
    JwtVerifierService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: AUTH_SERVICE_PORT,
      useClass: GrpcAuthServiceAdapter,
    },
  ],
  exports: [JwtVerifierService],
})
export class AuthModule {}
