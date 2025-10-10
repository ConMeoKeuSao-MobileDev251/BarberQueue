import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'abc123', description: 'username of the user' })
    @IsNotEmpty()
    @IsString()
    username: string

    @ApiProperty({ example: '123456', description: 'Password for the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string

    @ApiProperty({ example: 'Tom Holand', description: "User's full name" })
    @IsNotEmpty()
    @IsString()
    fullName: string

    @ApiProperty({ description: "User's date of birth" })
    @IsOptional()
    @IsDate()
    birthDate: Date

    @ApiProperty({ example: '0123456789', description: "User's phone number" })
    @IsNotEmpty()
    @IsString()
    @MinLength(9)
    phoneNumber: string

    @ApiProperty({ example: 'abc123@example.com', description: 'Password for the user' })
    @IsOptional()
    @IsEmail()
    email: string
}