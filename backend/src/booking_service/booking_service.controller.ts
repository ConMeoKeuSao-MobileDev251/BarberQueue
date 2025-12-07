import { Body, Controller, Post } from '@nestjs/common';
import { BookingServiceService } from './booking_service.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateBookingServiceDto } from 'src/dtos/booking_service.dto';

@ApiBearerAuth()
@Controller('booking-service')
export class BookingServiceController {
  constructor(private readonly bookingServiceService: BookingServiceService) {}

  @Roles(Role.CLIENT)
  @Post()
  @ApiOperation({ summary: 'Create new booking service' })
  async create(@Body() createBookingServiceDto: CreateBookingServiceDto) {
    return await this.bookingServiceService.create(createBookingServiceDto);
  }
}
