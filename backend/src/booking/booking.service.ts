import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookingDto } from 'src/dtos/booking.dto';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { BookingStatus } from 'src/enums/booking.enum';
import { Role } from 'src/enums/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createBookingDto: CreateBookingDto, user: CurrentUserDto) {
        try {
            if(user.userId !== createBookingDto.clientId){
                throw new ForbiddenException({
                    status: HttpStatus.FORBIDDEN,
                    message: 'You do not have permission to create booking for other clients'
                })
            }

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

    async getHistory(
        page: number, 
        limit: number,
        user: CurrentUserDto
    ) {
        try {
            const existingUser = await this.prismaService.user.findUnique({ where: { id: user.userId } });

            if (!existingUser) {  
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `User with id ${user.userId} does not exist`
                });
            }

            const skip = (page - 1) * limit;
            let whereCondition = {};

            if (user.role === Role.CLIENT) {
                whereCondition = { clientId: user.userId };
            } else if (user.role === Role.STAFF) {
                whereCondition = { staffId: user.userId };
            }

            const bookings = await this.prismaService.booking.findMany({
                where: whereCondition,
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            return bookings;
        } catch (error) {
            console.error(error);
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async changeStatus(
        bookingId: number, 
        status: BookingStatus,
        user: CurrentUserDto
    ) {
        try {
            const existingBooking = await this.prismaService.booking.findUnique({
                where: { id: bookingId }
            });
            if (!existingBooking) {
                throw new BadRequestException({
                    message: `Booking with id ${bookingId} does not exist`
                });
            }

            if (user.userId !== existingBooking.staffId && user.userId !== existingBooking.clientId) {
                throw new ForbiddenException('You do not have permission to change the status of this booking');
            }

            return await this.prismaService.booking.update({
                where: { id: bookingId },
                data: { status: status }
            });
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
