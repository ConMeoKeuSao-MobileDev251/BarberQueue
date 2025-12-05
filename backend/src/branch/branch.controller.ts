import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto, GetAllBranchDto } from 'src/dtos/branch.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@ApiBearerAuth()
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) { }

  @ApiOperation({ summary: 'Get branch by lat and long' })
  @Get()
  async getAll(@Query() getAllBranchDto: GetAllBranchDto) {
    return await this.branchService.getAll(getAllBranchDto)
  }

  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Create new branch' })
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchService.create(createBranchDto)
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete branch by Id' })
  async delete(@Param('id', ParseIntPipe) id: number){
    return await this.branchService.delete(id)
  }
}
