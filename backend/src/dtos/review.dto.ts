import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 1, description: 'Booking ID associated with the review' })
    bookingId: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 1, description: 'Branch ID associated with the review', required: false })
    branchId?: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(5)
    @ApiProperty({ example: 5, description: 'Rating given in the review (1-5)' })
    rating: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Great service!', description: 'Optional comment for the review', required: false })
    comment?: string;
}


export class ReviewResponseDto extends CreateReviewDto {
    @ApiProperty({ example: 1, description: "Review's Id" })
    id: number

    @ApiProperty({ type: () => Date })
    createdAt: Date

    @ApiProperty({ type: () => Date })
    updatedAt: Date
}

export class ReviewListResponseDto {
    @ApiProperty({ type: () => ReviewResponseDto, isArray: true })
    data: ReviewListResponseDto[]

    @ApiProperty({ example: 10, description: 'Total number of reviews' })
    total: number

    @ApiProperty({ example: 1, description: 'Current page number' })
    pages: number
}