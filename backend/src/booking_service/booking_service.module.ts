import { Module } from '@nestjs/common';
import { BookingServiceService } from './booking_service.service';
import { BookingServiceController } from './booking_service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BookingServiceController],
  providers: [BookingServiceService],
  imports: [PrismaModule],
})
export class BookingServiceModule {}
