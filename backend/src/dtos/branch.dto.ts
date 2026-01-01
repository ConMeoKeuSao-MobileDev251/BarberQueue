import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class GetAllBranchDto {
    @ApiProperty({
        description: "Branch's latitude",
        example: 175.9373,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    latitude: number

    @ApiProperty({
        description: "Branch's longitude",
        example: -45.4839,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    longitude: number
}

export class CreateBranchDto {
    @ApiProperty({
        description: 'the name of branch',
        example: '30Shine Thủ Đức',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        description: "branch's phone number",
        example: '0123456789',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(11)
    @MinLength(9)
    phoneNumber: string

    @ApiProperty({
        description: "branch's address id",
        example: 3,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    addressId: number
}

export class BranchResponseDto extends CreateBranchDto {
    @ApiProperty({
        description: "branch's id",
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number

    @ApiProperty({
        description: "branch's created at timestamp",
        example: new Date()
    })
    createdAt: Date

    @ApiProperty({
        description: "branch's updated at timestamp", 
        example: new Date()
    })
    updatedAt: Date
}