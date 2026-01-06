import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(user: CurrentUserDto, branchId: number) {
        try {
            const existingBranch = await this.prismaService.branch.findUnique({
                where: { id: branchId }
            });

            if (!existingBranch) {
                throw new BadRequestException(`Branch with id ${branchId} does not exist`);
            }

            if (await this.prismaService.favorite.findUnique({
                where: {
                    userId_branchId: {
                        userId: user.userId,
                        branchId: branchId
                    }
                }
            })) {
                throw new BadRequestException(`Branch with id ${branchId} is already in favorites`);
            }

            return await this.prismaService.favorite.create({
                data: {
                    userId: user.userId,
                    branchId: branchId
                }
            });
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getByUserId(
        user: CurrentUserDto
    ) {
        try {
            const existingUser = await this.prismaService.user.findUnique({
                where: { id: user.userId }
            });

            if (!existingUser) {
                throw new BadRequestException(`User with id ${user.userId} does not exist`);
            }

            return await this.prismaService.favorite.findMany({
                where: {
                    userId: user.userId
                },
                include: {
                    branch: true
                }
            });
        }catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(user: CurrentUserDto, branchId: number) {
        try {
            const existingFavorite = await this.prismaService.favorite.findUnique({
                where: {
                    userId_branchId: {
                        userId: user.userId,
                        branchId: branchId
                    }
                }
            });
            if (!existingFavorite) {
                throw new BadRequestException(`Favorite with branch id ${branchId} does not exist`);
            }
            return await this.prismaService.favorite.delete({
                where: {
                    userId_branchId: {
                        userId: user.userId,
                        branchId: branchId
                    }
                }
            });
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
