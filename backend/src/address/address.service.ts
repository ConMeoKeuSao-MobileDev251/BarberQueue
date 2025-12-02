import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

    async delete(id: number){
        try {
            const existingAddress = await this.prismaService.address.findUnique({where: {id: Number(id)}})

            if(!existingAddress) throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: `The address with id: ${id} does not exist`
            })

            return await this.prismaService.address.delete({where: {id: Number(id)}})
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException(error)
        }
    }
}
