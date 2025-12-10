import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { CurrentUserDto, UpdateUserDto, UserResponseDto } from 'src/dtos/user.dto';
import { Role } from 'src/enums/role.enum';

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

  async update(
    id: number, 
    data: UpdateUserDto, 
    user: CurrentUserDto
  ) {
    try {
      if(user.userId !== id){
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: 'You do not have permission to update other users'
        })
      }

      let existingUser = await this.prismaService.user.findUnique({
        where: { id: id },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      existingUser = this.buildUpdateData(existingUser, data);
      return await this.prismaService.user.update({
        where: { id: id },
        data: existingUser,
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

  async delete(id: number, user: CurrentUserDto) {
    try {
      if(user.userId === id){
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: 'You cannot delete your own account'
        })
      }

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

  async getAvailableStaffByBranchId(branchId: number, startTime: Date, endTime: Date) {
    try {
      const existingBranch = await this.prismaService.branch.findUnique({ where: { id: branchId } });
      if (!existingBranch) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: `Branch with id ${branchId} does not exist`
        });
      }

      const staffsInBranch = await this.prismaService.user.findMany({
        where: {
          branchId: branchId,
          role: Role.STAFF
        },
        select: this.userResponse
      });

      const availableStaffs = staffsInBranch.filter(async (staff) => {
        const conflictingBookings = await this.prismaService.booking.findMany({
          where: {
            staffId: staff.id,
            OR: [
              {
                startAt: {
                  gte: startTime,
                  lt: endTime
                }
              },
              {
                endAt: {
                  gt: startTime,
                  lte: endTime
                }
              },
              {
                startAt: {
                  lte: startTime
                },
                endAt: {
                  gte: endTime
                }
              }
            ]
          },
        });
        return conflictingBookings.length === 0;
      });

      return availableStaffs;
    } catch (error) {
      
    }
  }
}
