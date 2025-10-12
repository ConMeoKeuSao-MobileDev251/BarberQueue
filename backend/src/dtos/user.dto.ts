import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: '0123456789', description: "User's phone number" })
    @IsNotEmpty()
    @IsString()
    @MinLength(9)
    phoneNumber: string

    @ApiProperty({ example: '123456', description: 'Password for the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string

    @ApiProperty({ example: 'Tom Holand', description: "User's full name" })
    @IsNotEmpty()
    @IsString()
    fullName: string

    @ApiProperty({ description: "User's date of birth", required: false })
    @IsOptional()
    @IsDate()
    birthDate?: Date

    @ApiProperty({ 
        example: 'abc123@example.com', 
        description: 'Password for the user',
        required: false 
    })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty({ example: 'client', description: "user's role" })
    @IsNotEmpty()
    @IsString()
    role: string
}