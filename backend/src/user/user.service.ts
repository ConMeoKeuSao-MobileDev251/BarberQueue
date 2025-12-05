import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { UpdateUserDto } from 'src/dtos/user.dto';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  private readonly userResponse = {
    id: true,
    phoneNumber: true,
    fullName: true,
    email: true,
    birthDate: true,
    role: true,
    addressId: true,
    branchId: true,
    createdAt: true,
    updatedAt: true,
  }
  constructor(private readonly prismaService: PrismaService) { }

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

  async getById(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: this.userResponse
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user
    } catch (error) {
      this.logger.error(error);

      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      let user = await this.prismaService.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user = this.buildUpdateData(user, data);
      return await this.prismaService.user.update({
        where: { id: id },
        data: user,
        select: this.userResponse
      });

    } catch (error) {
      this.logger.error(error);

      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(id: number) {
    try {
      const existingUser = await this.prismaService.user.findUnique({ where: { id } })

      if (!existingUser) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: `User with id ${id} does not exist`
        })
      }

      return await this.prismaService.user.delete({
        where: { id },
        select: this.userResponse
      })
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
