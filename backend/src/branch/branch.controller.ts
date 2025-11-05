import { Controller, Get, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { GetAllBranchDto } from 'src/dtos/branch.dto';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  async getAll(@Query() getAllBranchDto: GetAllBranchDto){
    return await this.branchService.getAll(getAllBranchDto)
  }
}
