import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BarberServiceService } from './barber_service.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BarberServiceResponseDto, CreateBarberServiceDto } from 'src/dtos/barber_service.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@ApiBearerAuth()
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

  @Roles(Role.OWNER)
  @Post()
  @ApiOperation({summary: 'Create new barber service'})
  async create(@Body() createBarberServiceDto: CreateBarberServiceDto) {
    return await this.barberService.create(createBarberServiceDto)
  }
}
