import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNotificationDto } from 'src/dtos/notification.dto';
import { CurrentUserDto } from 'src/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private readonly prismaService: PrismaService) { }

    async getByUserId(
        page: number,
        limit: number,
        user: CurrentUserDto
    ) {
        try {
            const existingUser = await this.prismaService.user.findUnique({
                where: { id: user.userId }
            });

            if (!existingUser) {
                throw new BadRequestException(`User with id ${user.userId} does not exist`);
            }

            return await this.prismaService.notification.findMany({
                where: {
                    userId: user.userId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip: (page - 1) * limit
            })
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async markAsRead(id: number, user: CurrentUserDto) {
        try {
            const existingNotification = await this.prismaService.notification.findUnique({
                where: { id }
            });

            if (!existingNotification) {
                throw new BadRequestException(`Notification with id ${id} does not exist`);
            }

            if (existingNotification.userId !== user.userId) {
                throw new ForbiddenException('You do not have permission to mark this notification as read');
            }

            return await this.prismaService.notification.update({
                where: { id },
                data: { isRead: true }
            });
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async create(createNotificationDto: CreateNotificationDto){
        try {
            const existingUser = await this.prismaService.user.findUnique({
                where: { id: createNotificationDto.userId }
            });

            if (!existingUser) {
                throw new BadRequestException(`User with id ${createNotificationDto.userId} does not exist`);
            }

            return await this.prismaService.notification.create({
                data: createNotificationDto
            });
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
