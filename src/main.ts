import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

// Nouveau middleware personnalisé
import { Request, Response, NextFunction } from 'express';

function swaggerAuthMiddleware(configService: ConfigService) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.includes('/api')) {
      const user = configService.get<string>('SWAGGER_USER');
      const pass = configService.get<string>('SWAGGER_PASSWORD');

      const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
      const [login, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');

      if (login && password && login === user && password === pass) {
        return next();
      }

      res.set('WWW-Authenticate', 'Basic realm="401"');
      res.status(401).send('Authentication required.');
    } else {
      next();
    }
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  // Appliquer le middleware d'authentification pour Swagger
  app.use('/api', swaggerAuthMiddleware(configService));

  const config = new DocumentBuilder()
    .setTitle("Application de rencontre")
    .setDescription('La documentation API pour notre application de rencontre')
    .setVersion('1.0')
    // .addTag('Auth Social Media')
    // .addTag('Auth Classique')
    // .addTag('User')
    // .addTag('matching')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My API Docs',
    customJs: '/swagger-custom.js',
    useGlobalPrefix: true,
    swaggerUrl: '/swagger-json',
  });

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  await app.listen(3000);
  console.log(
    `Swagger documentation is available at http://localhost:3000/api`,
  );
}

bootstrap();
