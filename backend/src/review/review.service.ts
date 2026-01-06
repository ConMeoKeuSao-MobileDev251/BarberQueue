import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from 'src/dtos/review.dto';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(
        createReviewDto: CreateReviewDto, 
        user: CurrentUserDto
    ) {
        try {
            if (!(await this.prismaService.booking.findUnique({
                where: { id: createReviewDto.bookingId }
            }))) {  
                throw new ForbiddenException(`Booking with id ${createReviewDto.bookingId} does not exist`);
            }

            if (!await this.prismaService.user.findUnique({ 
                where: { id: user.userId }
            })) {
                throw new ForbiddenException(`User with id ${user.userId} does not exist`);
            }

            return await this.prismaService.review.create({
                data: {
                    ...createReviewDto,
                    userId: user.userId
                }
            });
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getByBranchId(
        branchId: number,
        page: number,
        limit: number
    ) {
        try {
            const existingBranch = await this.prismaService.branch.findUnique({
                where: { id: branchId }
            });
            if (!existingBranch) {
                throw new ForbiddenException(`Branch with id ${branchId} does not exist`);
            }

            const total = await this.prismaService.review.count({
                where: { branchId }
            });

            const data = await this.prismaService.review.findMany({
                where: { branchId },
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { createdAt: 'desc' }
            });

            const pages = Math.ceil(total / limit);

            return {
                data,
                total,
                pages,
            };
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
