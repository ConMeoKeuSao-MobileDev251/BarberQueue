import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsNumber } from "class-validator"

export class CreateBookingServiceDto  {
    @ApiProperty({ example: 1, description: "Booking's Id" })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    bookingId: number

    @ApiProperty({ example: [1,2], description: "List of Service's Id" })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Number)
    serviceId: number[]
}