import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateReviewDto, ReviewListResponseDto, ReviewResponseDto } from 'src/dtos/review.dto';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { CurrentUserDto } from 'src/dtos/user.dto';

@Controller('review')
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Roles(Role.CLIENT)
  @Post()
  @ApiOperation({ summary: 'create new review' })
  @ApiResponse({
    description: 'Review created successfully',
    type: ReviewResponseDto
  })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: CurrentUserDto
  ) { 
    return await this.reviewService.create(createReviewDto, user);
  }

  @Get('/branch/:branchId')
  @ApiOperation({ summary: 'get reviews by branch id' })
  @ApiResponse({
    description: 'Reviews retrieved successfully',
    type: ReviewListResponseDto
  })
  async getByBranchId(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return await this.reviewService.getByBranchId(branchId, page, limit);
  }
}
