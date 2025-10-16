import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./user.dto";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Type } from "class-transformer";

export class RegisterDto extends CreateUserDto{
    @ApiProperty({
        example: '12',
        description: "existing address id, must have if user's role is staff",
        required: false
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    addressId?: number

    @ApiProperty({
        example: '12',
        description: "existing branch Id, must have if user's role is staff",
        required: false
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    branchId?: number

    @ApiProperty({
        example: '254 ABC street, ward 15, Go Vap, Ho Chi Minh city, Vietnam',
        description: 'full address',
        required: false
    })
    @IsOptional()
    @IsString()
    addressText?: string

    @ApiProperty({
        example: '176.00013',
        description: "Address's latitude",
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    latitude?: number

    @ApiProperty({
        example: '176.00013',
        description: "Address's longitude",
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    longitude?: number
}


export class RegisterResponseDto {
    @ApiProperty({ example: 'ey....', description: 'an accessToken for user token call guarded API'})
    accessToken: string

    @ApiProperty({ example: 'Nguyễn Văn A', description: "user full name for display somewhere"})
    fullName: string

    @ApiProperty({ example: 'client', description: "user's role"})
    role: string
}

export class LoginReqDto {
    @ApiProperty({ example: '0123456789', description: 'phone number to login' })
    @IsString()
    @IsNotEmpty()
    @Length(10, 10, { message: 'Phone number must be exactly 10 characters' })
    phone_number: string

    @ApiProperty({ example: 'password123', description: 'password to login' })
    @IsString()
    @IsNotEmpty()
    password: string
}

export class LoginResDto {
    @ApiProperty({ example: 'ey....', description: 'an accessToken for user token call guarded API'})
    accessToken: string

    @ApiProperty({ example: 'Nguyễn Văn A', description: "user full name for display somewhere"})
    fullName: string

    @ApiProperty({ example: 'client', description: "user's role"})
    role: string
}