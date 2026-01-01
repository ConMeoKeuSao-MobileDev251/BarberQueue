import { ApiProperty } from "@nestjs/swagger"
import { BranchResponseDto } from "./branch.dto"

export class FavoriteResponseDto {
    @ApiProperty({ example: 1, description: "User's id" })
    userId: number

    @ApiProperty({ example: 1, description: "Branch's id" })
    branchId: number

    @ApiProperty({ type: () => Date })
    createdAt: Date


    @ApiProperty({ type: () => BranchResponseDto })
    branch: BranchResponseDto
}