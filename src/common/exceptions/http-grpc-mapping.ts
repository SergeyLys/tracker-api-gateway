import {
  HttpStatus,
} from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

export const HTTP_CODE_FROM_GRPC: Record<GrpcStatus, HttpStatus> = {
  [GrpcStatus.OK]: HttpStatus.OK,
  [GrpcStatus.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
  [GrpcStatus.UNKNOWN]: HttpStatus.BAD_GATEWAY,
  [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
  [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
  [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
  [GrpcStatus.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
  [GrpcStatus.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
  [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAVAILABLE]: HttpStatus.NOT_FOUND,
  [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};