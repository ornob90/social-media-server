import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomErrorResponse } from 'src/types/middleware.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    let errorResponse: CustomErrorResponse = {
      acknowledgement: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    if (typeof message === 'string') errorResponse.message = message;
    else {
      errorResponse = {
        ...errorResponse,
        ...message,
      };
    }
    response.status(status).send(errorResponse);
  }
}
