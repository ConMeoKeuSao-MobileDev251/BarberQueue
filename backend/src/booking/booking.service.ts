import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookingDto } from 'src/dtos/booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createBookingDto: CreateBookingDto) {
        try {
            const existingClient = await this.prismaService.user.findUnique({
                where: { id: createBookingDto.clientId }
            })

            if (!existingClient) {
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `The client with id ${createBookingDto.clientId} does not exist`
                })
            }

            const existingStaff = await this.prismaService.user.findUnique({
                where: { id: createBookingDto.staffId }
            })

            if (!existingStaff) {
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `The staff with id ${createBookingDto.clientId} does not exist`
                })
            }

            return await this.prismaService.booking.create({
                data: createBookingDto
            })
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
