import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '0123456789', description: "User's phone number" })
  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: 'Password for the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Tom Holand', description: "User's full name" })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: "User's date of birth", required: false })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @ApiProperty({
    example: 'abc123@example.com',
    description: 'Email for the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'client', description: "user's role" })
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '0123456789', description: "User's phone number" })
  phoneNumber: string;

  @ApiProperty({ example: 'Tom Holand', description: "User's full name" })
  fullName: string;

  @ApiProperty({ description: "User's date of birth" })
  birthDate: Date;

  @ApiProperty({
    example: 'abc123@example.com',
    description: 'Email for the user',
  })
  email: string;

  @ApiProperty({ example: 'client', description: "user's role" })
  role: string;

  @ApiProperty({
    example: '12',
    description: "existing address id, must have if user's role is staff",
  })
  addressId: number;

  @ApiProperty({
    example: '12',
    description: "existing branch Id, must have if user's role is staff",
  })
  branchId: number;

  @ApiProperty({
    description: 'The date and time when the user was created',
    example: '2023-10-10T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the user was last updated',
    example: '2023-10-15T12:00:00.000Z',
  })
  updatedAt: Date;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role']),
) {}
