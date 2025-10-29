// src/common/mappers/user.mapper.ts
import { User } from 'generated/prisma/'

export class UserMapper {
  static toGetByIdResponse(user: User) {
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      email: user.email,
      birthDate: user.birthDate,
      role: user.role,
      addressId: user.addressId,
      branchId: user.branchId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
