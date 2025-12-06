import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBarberServiceDto {
    @ApiProperty({ example: 'Cắt tóc', description: 'The name of the barber service' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 30, description: 'The duration of the service in minutes' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    duration: number;



    @ApiProperty({ example: 15.99, description: 'The price of the barber service' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number;
}

export class BarberServiceResponseDto extends CreateBarberServiceDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the barber service' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number;
}
