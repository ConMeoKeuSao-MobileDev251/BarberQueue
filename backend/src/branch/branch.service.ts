import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateBranchDto, GetAllBranchDto } from 'src/dtos/branch.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BranchService {
    private readonly logger = new Logger('BranchService')
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
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async create(createBranchDto: CreateBranchDto) {
        try {
            const existingAddress = await this.prismaService.address.findUnique({
                where: { id: createBranchDto.addressId }
            })

            if (!existingAddress) {
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `Address with id ${createBranchDto.addressId} does not exist`
                })
            }

            return await this.prismaService.branch.create({
                data: createBranchDto
            })
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(id: number) {
        try {
            const existingAddress = await this.prismaService.branch.findUnique({ where: { id } })

            if (!existingAddress) throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: `The branch with id: ${id} does not exist`
            })

            return await this.prismaService.branch.delete({ where: { id } })
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
