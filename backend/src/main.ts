import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug']
  });

  const config = new DocumentBuilder()
  .setTitle('BarberQueue API')
  .setDescription('API Documentation for BarberQueue project')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
