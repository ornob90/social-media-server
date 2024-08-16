import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
          return {
            acknowledgement: true,
            data: data,
            timestamp: new Date().toISOString(),
          };
        }

        // Return the original data for non-success responses
        return data;
      }),
    );
  }
}
