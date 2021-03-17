import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError(error => {
        let msg: unknown;

        if (this.isOneValidationError(error)) {
          msg = error.toString(false);
        } else if (this.isValidationErrorArray(error)) {
          msg = error.map(e => e.toString(false));
        } else {
          msg = error;
        }

        return throwError(new BadRequestException(msg));
      }),
    );
  }

  private isOneValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }

  private isValidationErrorArray(errors: unknown): errors is ValidationError[] {
    return (
      Array.isArray(errors) && errors.every(e => e instanceof ValidationError)
    );
  }
}
