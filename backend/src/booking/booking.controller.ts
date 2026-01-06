import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingResponseDto, CreateBookingDto } from 'src/dtos/booking.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { BookingStatus } from 'src/enums/booking.enum';

@ApiBearerAuth()
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'create new booking' })
  @ApiResponse({
    description: 'Booking created successfully',
    type: BookingResponseDto
  })
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: CurrentUserDto) {
    return await this.bookingService.create(createBookingDto, user)
  }



  @ApiOperation({ summary: 'get history bookings by user role and id' })
  @ApiResponse({
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto]
  })
  @Get('/:role/:id/history')
  async getHistory(
    @Param('role') role: Role,
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @CurrentUser() user: CurrentUserDto
   ) {
    return await this.bookingService.getHistory(role, id, page, limit, user);
  }

  @ApiOperation({ summary: 'change booking status' })
  @ApiResponse({
    description: 'Booking status changed successfully',
    type: BookingResponseDto
  })
  @Post('/:bookingId/status/:status')
  async changeStatus(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Param('status') status: BookingStatus,
    @CurrentUser() user: CurrentUserDto
  ) {
    return await this.bookingService.changeStatus(bookingId, status, user);
  }
}

