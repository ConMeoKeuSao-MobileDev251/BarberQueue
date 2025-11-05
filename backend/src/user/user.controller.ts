import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto, UserResponseDto } from 'src/dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @ApiOperation({summary: "get user by id"})
  @ApiOkResponse({
    description: "ok",
    type: UserResponseDto
  })
  async getUserById(@Param('id', ParseIntPipe) id: number){
    return await this.userService.getUserById(id);
  }

  @Put('/:id')
  @ApiOperation({summary: "update user"})
  @ApiOkResponse({
    description: "ok",
    type: UserResponseDto
  })
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto){
    return await this.userService.updateUser(id, body);
  }
}
