import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { VerifiedRequestInterface } from 'src/types/middleware.types';

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
  use(req: VerifiedRequestInterface, res: Response, next: NextFunction) {
    const decoded = {
      _id: '66bed10aa209dc2e3b0176e9',
      displayName: 'Kazi Towfiq',
      email: 'ornonornob@gmail.com',
    };
    req.user = decoded;
    next();
  }
}
