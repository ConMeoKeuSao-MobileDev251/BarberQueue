import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookingDto } from 'src/dtos/booking.dto';
import { Role } from 'src/enums/role.enum';
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

    async getHistory(role: string, id: number, page: number, limit: number) {
        try {
            const existingUser = await this.prismaService.user.findUnique({ where: { id } });

            if (!existingUser) {  
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `User with id ${id} does not exist`
                });
            }

            if (role !== existingUser.role) {
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `User with id ${id} does not have role ${role}`
                });
            }

            const skip = (page - 1) * limit;
            let whereCondition = {};

            if (role === Role.CLIENT) {
                whereCondition = { clientId: id };
            } else if (role === Role.STAFF) {
                whereCondition = { staffId: id };
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
}
