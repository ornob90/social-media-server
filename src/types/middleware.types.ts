import { Payload } from './auth.types';

export interface VerifiedRequestInterface extends Request {
  user: Payload;
}
