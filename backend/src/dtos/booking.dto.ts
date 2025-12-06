import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateBookingDto {
    @ApiProperty({ example: 'pending', description: "Booking's status" })
    @IsNotEmpty()
    @IsString()
    status: string

    @ApiProperty({ example: new Date(), description: "Booking's start time" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startAt: Date

    @ApiProperty({ example: new Date(), description: "Booking's end time" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endAt: Date

    @ApiProperty({ example: 60, description: "Booking's total duration in minutes" })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    totalDuration: number

    @ApiProperty({ example: 250000, description: "Booking's total price" })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    totalPrice: number

    @ApiProperty({ example: 1, description: "Client's Id" })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    clientId: number

    @ApiProperty({ example: 2, description: "Staff's Id" })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    staffId: number
}