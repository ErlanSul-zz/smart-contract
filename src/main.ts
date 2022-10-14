import { NestFactory } from '@nestjs/core';
import { AppModule, configService } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger initialization
  const config = new DocumentBuilder()
    .setTitle('Orders book')
    .setDescription('Orders book')
    .setVersion('1.0')
    .addTag('SmartContract')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(configService.serverPort, configService.serverHost);
}

void bootstrap().then(() => {
  //
});
