import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { VerifiedRequestInterface } from 'src/types/middleware.types';

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
  use(req: VerifiedRequestInterface, res: Response, next: NextFunction) {
    const decoded = {
      _id: '66d5e8babb3a271cf394f8d3',
      displayName: 'Kazi Towfiq',
      email: 'ornonornob@gmail.com',
    };
    req.user = decoded;
    next();
  }
}
