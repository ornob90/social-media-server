import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    try {
      delete updateUserDto.password;

      const updateResponse = await this.userModel.updateOne(
        { _id: userId },
        {
          $set: updateUserDto,
        },
      );

      // if user updated then return null
      if (updateResponse.acknowledged && updateResponse.modifiedCount > 0) {
        return null;
      }

      // else throw error
      throw new NotFoundException('No user updated!');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
