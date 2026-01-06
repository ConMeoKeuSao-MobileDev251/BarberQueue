import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { CreateNotificationDto, NotificationResponseDto } from 'src/dtos/notification.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/user')
  @ApiOperation({ summary: 'Get notifications with pagination' })
  @ApiResponse({
    description: 'Notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  async getByUserId(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @CurrentUser() user: CurrentUserDto
  ) {
    return await this.notificationService.getByUserId(page, limit, user);
  }

  @ApiOperation({ summary: 'Mark notification as read by id' })
  @ApiResponse({
    description: 'Notification marked as read successfully',
    type: NotificationResponseDto,
  })
  @Get('/:id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto
  ) {
    return await this.notificationService.markAsRead(id, user);
  }

  @Roles(Role.OWNER, Role.STAFF)
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({
    description: 'Notification created successfully',
    type: NotificationResponseDto,
  })
  @Post('/create')
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }
}
