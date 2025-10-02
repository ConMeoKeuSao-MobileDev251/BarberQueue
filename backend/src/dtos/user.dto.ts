import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    @Min(6)
    password: string

    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsOptional()
    @IsDate()
    birthDate: Date

    @IsNotEmpty()
    @IsString()
    @Min(9)
    phoneNumber: string

    @IsOptional()
    @IsEmail()
    email: string
}