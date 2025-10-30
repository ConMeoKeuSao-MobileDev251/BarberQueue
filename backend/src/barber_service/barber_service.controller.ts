import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BarberServiceService } from './barber_service.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BarberServiceResponseDto } from 'src/dtos/barber_service.dto';

@Controller('barber-services')
export class BarberServiceController {
  constructor(private readonly barberService: BarberServiceService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get barber service by ID' })
  @ApiOkResponse({
    description: 'Retrieve a barber service by its ID',
    type: BarberServiceResponseDto,
  })
  async getBarberServiceById(@Param('id', ParseIntPipe) id: number) {
    return await this.barberService.getBarberServiceById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all barber services' })
  @ApiOkResponse({
    description: 'Retrieve all barber services',
    type: [BarberServiceResponseDto],
  })
  async getAllBarberServices() {
    return await this.barberService.getAllBarberServices();
  }
}
