import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CustomResponseInterface,
  CustomSuccessResponse,
} from 'src/types/middleware.types';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;

        // Only format successful responses (status codes 200-299)
        if (statusCode >= 200 && statusCode < 300) {
          const customResponse: CustomSuccessResponse = {
            acknowledgement: true,
            statusCode,
            data: data,
            timestamp: new Date().toISOString(),
          };

          if (!data) {
            delete customResponse.data;
          }

          return customResponse;
        }

        // Return the original data for non-success responses
        return data;
      }),
    );
  }
}
