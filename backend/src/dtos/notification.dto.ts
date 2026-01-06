import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsString } from "class-validator"
import { NotificationType } from "src/enums/notification.enum"

export class CreateNotificationDto {
    @ApiProperty({ example: 1, description: "User's id" })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    userId: number

    @ApiProperty({ example: 'booking', description: 'Type of notification' })
    @IsNotEmpty()
    @IsString()
    type: NotificationType

    @ApiProperty({ example: 'New message', description: 'Title of notification' })
    @IsNotEmpty()
    @IsString()
    message: string

    @ApiProperty({ example: 'Welcome', description: 'Title of notification' })
    @IsNotEmpty()
    @IsString()
    title: string
}

export class NotificationResponseDto extends CreateNotificationDto {
    @ApiProperty({ example: 1, description: "Notification's Id" })
    id: number

    @ApiProperty({ example: false, description: "Notification's read status" })
    isRead: boolean

    @ApiProperty({ type: () => Date })
    createdAt: Date
}