import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateAddressDto } from 'src/dtos/address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
    private readonly logger = new Logger('AddressService')
    constructor(private readonly prismaService: PrismaService) { }

    async getAll() {
        try {
            return await this.prismaService.address.findMany()
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException(error)
        }
    }

    async create(createAddressDto: CreateAddressDto) {
        try {
            return await this.prismaService.address.create({
                data: createAddressDto
            })
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException(error)
        }
    }
}
