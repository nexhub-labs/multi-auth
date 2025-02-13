import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class APIGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) throw new HttpException("No API key provided", HttpStatus.UNAUTHORIZED);
    if (apiKey !== process.env.X_API_KEY) throw new HttpException("Invalid API key", HttpStatus.UNAUTHORIZED);
    return apiKey === process.env.X_API_KEY;
  }
}
