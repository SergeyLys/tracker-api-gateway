import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request, Response } from 'express';
import type { ReqId } from 'pino-http';
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

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

interface RequestWithId extends Request {
  id: ReqId;
  user?: { id: string | number };
}

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  requestId: ReqId;
  message?: string | string[];
  error?: string;
  stack?: string;
}

interface GrpcError {
  code: GrpcStatus;
  details: string;
}

interface ErrorData {
  message?: string | string[];
  errorName?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  private isGrpcException(exception: unknown): exception is GrpcError {
    return (exception &&
      typeof exception === 'object' &&
      'code' in exception &&
      'details' in exception) as boolean;
  }

  private isHttpException(exception: unknown): exception is HttpException {
    return exception instanceof HttpException;
  }

  private getStatusCode(exception: unknown): number {
    if (this.isHttpException(exception)) {
      return exception.getStatus();
    }

    if (this.isGrpcException(exception)) {
      return HTTP_CODE_FROM_GRPC[exception.code];
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorData(exception: unknown): ErrorData {
    if (this.isHttpException(exception)) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        return { message: resp };
      } else if (resp && typeof resp === 'object') {
        const body = resp as ErrorResponse;
        return {
          message: body.message ?? resp,
          errorName: body.error ?? exception.name,
        };
      }
    }

    if (this.isGrpcException(exception)) {
      return {
        message: exception.details,
      };
    }
    return {
      message: 'Internal server error',
    };
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    if (!httpAdapter || !host.switchToHttp) {
      if (exception instanceof Error) {
        this.logger.error?.(exception.message, exception.stack);
      }
      throw exception;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestWithId>();
    const response = ctx.getResponse<Response>();

    const status = this.getStatusCode(exception);
    const { message, errorName } = this.getErrorData(exception);

    const logData = {
      method: request.method,
      url: request.url,
      statusCode: status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId: request.id,
      userId: request.user?.id ?? 'anonymous',
      errorName,
      message: typeof message === 'string' ? message : message?.[0],
    };

    const stack = exception instanceof Error ? exception.stack : undefined;

    if (status >= 500) {
      this.logger.error(logData, stack);
    } else {
      this.logger.warn(logData);
    }

    const responseBody: ErrorResponseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId: request.id,
      message,
    };

    if (process.env.NODE_ENV === 'development' && status >= 500) {
      responseBody.error = errorName;
      if (exception instanceof Error) {
        responseBody.stack = exception.stack;
      }
    }

    httpAdapter.reply(response, responseBody, status);
  }
}
