import { Controller, Get, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from 'src/dtos/address.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ description: 'Get all address'})
  @Get()
  async getAll() {
    return await this.addressService.getAll()
  }

  @ApiOperation({ description: 'Create new address'})
  @Post()
  async create(createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto)
  }
}
