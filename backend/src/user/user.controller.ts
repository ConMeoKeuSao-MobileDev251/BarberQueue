import { Body, Controller, Delete, Get, Param, ParseDatePipe, ParseIntPipe, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentUserDto, UpdateUserDto, UserResponseDto } from 'src/dtos/user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CurrentUser } from 'src/decorators/current_user.decorator';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({summary: "get user by id"})
  @ApiOkResponse({
    description: "ok",
    type: UserResponseDto
  })
  async getById(@Param('id', ParseIntPipe) id: number){
    return await this.userService.getById(id);
  }

  @Get('/staff/:branchId/availability')
  @ApiOperation({summary: "get available staff by branch id and time range"})
  @Roles(Role.OWNER, Role.CLIENT)
  async getAvailableStaffByBranchId(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime: Date
  ){
    return await this.userService.getAvailableStaffByBranchId(branchId, startTime, endTime);
  }

  @Put(':id')
  @ApiOperation({summary: "update user"})
  @ApiOkResponse({
    description: "ok",
    type: UserResponseDto
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateUserDto,
    @CurrentUser() user: CurrentUserDto
  ){
    return await this.userService.update(id, body, user);
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  @ApiOperation({summary: "delete user by id"})
  async delete (
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto
  ){
    return await this.userService.delete(id, user)
  }
}
