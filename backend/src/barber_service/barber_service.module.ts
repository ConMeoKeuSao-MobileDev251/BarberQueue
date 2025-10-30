import { Module } from '@nestjs/common';
import { BarberServiceController } from './barber_service.controller';
import { BarberServiceService } from './barber_service.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BarberServiceController],
  providers: [BarberServiceService],
})
export class BarberServiceModule {}
