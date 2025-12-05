import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto, UserResponseDto } from 'src/dtos/user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

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

  @Put(':id')
  @ApiOperation({summary: "update user"})
  @ApiOkResponse({
    description: "ok",
    type: UserResponseDto
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto){
    return await this.userService.update(id, body);
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  @ApiOperation({summary: "delete user by id"})
  async delete (@Param('id', ParseIntPipe) id: number){
    return await this.userService.delete(id)
  }
}
