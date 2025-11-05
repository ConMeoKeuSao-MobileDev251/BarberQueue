import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber } from "class-validator"

export class GetAllBranchDto{
    @ApiProperty({example: 175.9373, required: true})
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    latitude: number

    @ApiProperty({example: -45.4839, required: true})
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    longitude: number
}