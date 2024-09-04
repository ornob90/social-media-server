import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ParseObjectId implements PipeTransform {
  transform(value: any) {
    // Check if the value is a valid ObjectId
    if (Types.ObjectId.isValid(value)) {
      // Return the value converted to ObjectId
      return Types.ObjectId.createFromHexString(value);
    }

    // If not valid, throw an error
    throw new BadRequestException(`Invalid ObjectId: ${value}`);
  }
}
