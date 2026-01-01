import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Favorite } from 'generated/prisma';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FavoriteResponseDto } from 'src/dtos/favorite.dto';

@Roles(Role.CLIENT)
@ApiBearerAuth()
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('branch/:branchId')
  @ApiOperation({ summary: 'Add a branch to favorites' })
  @ApiResponse({
    description: 'Branch added to favorites successfully',
    type: FavoriteResponseDto,
  })
  async create(
    @Param('branchId', ParseIntPipe) branchId: number, 
    @CurrentUser() user: CurrentUserDto
  ) {
    return await this.favoriteService.create(user, branchId);
  }

  @Get('/user')
  @ApiOperation({ summary: 'Get favorites of current user' })
  @ApiResponse({
    description: 'Favorites retrieved successfully',
    type: [FavoriteResponseDto],
  })
  async getByUserId(
    @CurrentUser() user: CurrentUserDto
  ) {
    return await this.favoriteService.getByUserId(user);
  }

  @Delete('branch/:branchId')
  @ApiOperation({ summary: 'Remove a branch from favorites' })
  @ApiResponse({
    description: 'Branch removed from favorites successfully',
    type: FavoriteResponseDto,
  })
  async delete(
    @Param('branchId', ParseIntPipe) branchId: number, 
    @CurrentUser() user: CurrentUserDto
  ) {
    return await this.favoriteService.delete(user, branchId);
  } 
}
