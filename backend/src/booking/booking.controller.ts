import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateBookingDto } from 'src/dtos/booking.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@ApiBearerAuth()
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'create new booking'})
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto){
    return await this.bookingService.create(createBookingDto)
  }

  @ApiOperation({ summary: 'get booking list with pagination'})
  @Get('/paging')
  async getPaging( ){}
}
