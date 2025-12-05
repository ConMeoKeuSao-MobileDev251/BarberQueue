import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from 'src/dtos/address.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Get()
  @ApiOperation({ summary: 'Get all address' })
  async getAll() {
    return await this.addressService.getAll()
  }

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto)
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete address by Id'})
  async delete(@Param('id') id: number){
    return await this.addressService.delete(id)
  }
}
