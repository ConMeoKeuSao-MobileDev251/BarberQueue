import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAddressDto } from 'src/dtos/address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
    constructor (private readonly prismaService: PrismaService) {}

    async getAll(){
        try {
            return await this.prismaService.address.findMany()
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(error)
        }
    }

    async create(createAddressDto: CreateAddressDto) {
        try {
            return await this.prismaService.address.create({
                data: createAddressDto
            })
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(error)
        }
    }
}
