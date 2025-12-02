import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateAddressDto {
    @ApiProperty({
        description: 'Address text',
        example: '224 Đ. Số 48, Phường 2, Quận 4, Thành phố Hồ Chí Minh, Việt Nam',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    addressText: string

    @ApiProperty({
        description: "Address's latitude",
        example: 174.394
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    latitude: number

    @ApiProperty({
        description: "Address's longitude",
        example: 174.394
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    longitude: number
}