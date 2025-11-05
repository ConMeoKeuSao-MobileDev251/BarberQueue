import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { UpdateUserDto } from 'src/dtos/user.dto';
import { UserMapper } from 'src/mappers/user.mapper';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return UserMapper.toGetByIdResponse(user);
    } catch (error) {
      this.logger.error(error);

      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateUser(id: number, data: UpdateUserDto) {
    try {
      let user = await this.prismaService.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user = this.buildUpdateData(user, data);
      const updatedUser = this.prismaService.user.update({
        where: { id: id },
        data: user,
      });

      return UserMapper.toGetByIdResponse(await updatedUser);
    } catch (error) {
      this.logger.error(error);

      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  private buildUpdateData(model: User, data: UpdateUserDto): User {
    if (data.phoneNumber !== undefined) {
      model.phoneNumber = data.phoneNumber;
    }

    if (data.fullName !== undefined) {
      model.fullName = data.fullName;
    }

    if (data.birthDate !== undefined) {
      model.birthDate = data.birthDate;
    }

    if (data.email !== undefined) {
      model.email = data.email;
    }

    model.updatedAt = new Date();

    return model;
  }
}
