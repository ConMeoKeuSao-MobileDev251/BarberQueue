import { ApiProperty } from "@nestjs/swagger";

export class CreateBarberServiceDto {
    @ApiProperty({ example: 'Cắt tóc', description: 'The name of the barber service' })
    name: string;

    @ApiProperty({ example: 30, description: 'The duration of the service in minutes' })
    duration: number;

    @ApiProperty({ example: 15.99, description: 'The price of the barber service' })
    price: number;
}

export class BarberServiceResponseDto extends CreateBarberServiceDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the barber service' })
    id: number;
}
