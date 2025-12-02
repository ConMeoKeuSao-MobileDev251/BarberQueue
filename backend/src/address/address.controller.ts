import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from 'src/dtos/address.dto';
import { ApiOperation } from '@nestjs/swagger';

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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address by Id'})
  async delete(@Param('id') id: number){
    return await this.addressService.delete(id)
  }
}
