import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto, GetAllBranchDto } from 'src/dtos/branch.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) { }

  @ApiOperation({ summary: 'Get branch by lat and long' })
  @Get()
  async getAll(@Query() getAllBranchDto: GetAllBranchDto) {
    return await this.branchService.getAll(getAllBranchDto)
  }

  @ApiOperation({ summary: 'Create new branch' })
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchService.create(createBranchDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete branch by Id' })
  async delete(@Param('id') id: number){
    return await this.branchService.delete(id)
  }
}
