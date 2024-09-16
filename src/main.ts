import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import "./instrument";

async function bootstrap(){


  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle("API de l'application de rencontre AuthService")
    .setDescription("La documentation API pour notre application de rencontre")
    .setVersion('1.0')
    .addTag('Auth Classique')
    .addTag('User')
    .addBearerAuth()
    .build()


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Swagger documentation is available at http://localhost:3000/api`);
}
bootstrap();
