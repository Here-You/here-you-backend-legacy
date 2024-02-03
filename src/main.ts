import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Todo: Enable CORS only for development, specify the origin in production
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
