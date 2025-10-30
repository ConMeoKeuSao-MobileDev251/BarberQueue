import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BarberServiceMapper } from 'src/mappers/barber_service.mapper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BarberServiceService {
  private readonly logger = new Logger('BarberServiceService');
  constructor(private readonly prismaService: PrismaService) {}

  async getBarberServiceById(id: number) {
    try {
      const service = await this.prismaService.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new NotFoundException('Barber service not found');
      }

      return BarberServiceMapper.toResponse(service);
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
      const services = await this.prismaService.service.findMany();
      return BarberServiceMapper.toListResponse(services);
    } catch (error) {
      this.logger.error(error);
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
