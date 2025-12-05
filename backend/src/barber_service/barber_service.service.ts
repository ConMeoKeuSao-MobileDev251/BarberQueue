import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBarberServiceDto } from 'src/dtos/barber_service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BarberServiceService {
  private readonly logger = new Logger('BarberServiceService');
  constructor(private readonly prismaService: PrismaService) { }

  async getBarberServiceById(id: number) {
    try {
      const service = await this.prismaService.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new NotFoundException('Barber service not found');
      }

      return service
    } catch (error) {
      this.logger.error(error);
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllBarberServices() {
    try {
      return await this.prismaService.service.findMany();
    } catch (error) {
      this.logger.error(error);
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async create(createBarberServiceDto: CreateBarberServiceDto) {
    try {
      return await this.prismaService.service.create({ data: createBarberServiceDto })
    } catch (error) {
      this.logger.error(error);
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
