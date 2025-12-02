import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBranchDto, GetAllBranchDto } from 'src/dtos/branch.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BranchService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAll(getAllBranchDto: GetAllBranchDto) {
        try {
            const branches = await this.prismaService.branch.findMany({
                include: {
                    address: true
                }
            })

            return branches.map((branch) => {
                return {
                    ...branch,
                    distance: Math.sqrt(Math.abs(branch.address.latitude - getAllBranchDto.latitude) + Math.abs(branch.address.longitude - getAllBranchDto.longitude))
                }
            }).sort((a, b) => a.distance - b.distance)
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(error)
        }
    }

    async create(createBranchDto: CreateBranchDto){
        try {
            return await this.prismaService.branch.create({
                data: createBranchDto
            })
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(error)
        }
    }
}
