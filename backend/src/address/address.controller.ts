import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from 'src/dtos/address.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Get()
  @ApiOperation({ description: 'Get all address' })
  async getAll() {
    return await this.addressService.getAll()
  }

  @Post()
  @ApiOperation({ description: 'Create new address' })
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto)
  }
}
