import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookingServiceDto } from 'src/dtos/booking_service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingServiceService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createBookingServiceDto: CreateBookingServiceDto) {
        try {
            const existingBooking = await this.prismaService.booking.findUnique({
                where: { id: createBookingServiceDto.bookingId }
            });

            if (!existingBooking) {
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `Booking with id ${createBookingServiceDto.bookingId} does not exist`
                });
            }

            return await this.prismaService.$transaction(async (prisma) => {
                const bookingServices = await Promise.all(createBookingServiceDto.serviceId.map(async (serviceId) => {
                    const existService = await prisma.service.findUnique({
                        where: { id: serviceId }
                    });

                    if(!existService) {
                        throw new BadRequestException({
                            status: HttpStatus.BAD_REQUEST,
                            message: `Service with id ${serviceId} does not exist`
                        }); 
                    }
                    
                    return {
                        bookingId: createBookingServiceDto.bookingId,
                        serviceId: serviceId
                    }
                }));
                return await prisma.bookingService.createMany({
                    data: bookingServices
                });
            });
        } catch (error) {
            console.error(error)
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('error when create booking service', error);
        }
    }
}
