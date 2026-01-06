import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsInt, IsNotEmpty, IsNumber } from "class-validator"

export class CreateBookingDto {
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
    @IsInt()
    @Type(() => Number)
    clientId: number

    @ApiProperty({ example: 2, description: "Staff's Id" })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    staffId: number

    @ApiProperty({ example: 1, description: "Branch's Id" })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    branchId: number
}

export class BookingResponseDto extends CreateBookingDto{
    @ApiProperty({ example: 1, description: "Booking's Id" })
    id: number

    @ApiProperty({ example: 1, description: "Booking's status" })
    createdAt: Date

    @ApiProperty({ example: new Date(), description: "Booking's last update time" })
    updatedAt: Date

    @ApiProperty({ example: 'comfirm', description: "Booking's status" })
    status: string
} 