import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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



  @ApiOperation({ summary: 'get history bookings by user role and id'})
  @Get('/:role/:id/history')
  async getHistory(
    @Param('role') role: Role,
    @Param('id') id: number,
    @Query('page') page: number,
    @Query('limit') limit: number
   ){
    return await this.bookingService.getHistory(role, id, page, limit);
   }
}

