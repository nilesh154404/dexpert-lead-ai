import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Serve uploaded files statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Enable CORS - Support multiple frontend origins
  const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',')
    : ['http://localhost:8089', 'http://localhost:5173', 'https://lead-ai.dexpertsystems.com', 'dexchat.dexpertsystems.com', 'https://lead-ai-backend.dexpertsystems.com'];

  // app.enableCors({
  //   origin: "*",
  //   // (origin, callback) => {
  //   //   // Allow requests with no origin (like mobile apps or curl requests)
  //   //   if (!origin) return callback(null, true);

  //   //   // Allow Swagger UI
  //   //   if (origin.includes('localhost:3000')) return callback(null, true);

  //   //   if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
  //   //     callback(null, true);
  //   //   } else {
  //   //     callback(new Error('Not allowed by CORS'));
  //   //   }
  //   // },
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  app.enableCors({
    origin: [
      'http://localhost:8089',
      'http://localhost:5173',
      'https://lead-ai.dexpertsystems.com',
      "https://dexchat.dexpertsystems.com"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });


  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix with versioning
  app.setGlobalPrefix('api');

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });





  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Dexpert Lead AI API')
    .setDescription('Backend API for Dexpert Lead AI - Lead management and AI-powered conversations')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('leads', 'Lead management endpoints')
    .addTag('appointments', 'Appointment management endpoints')
    .addTag('conversations', 'Conversation and message endpoints')
    .addTag('users', 'User and team management endpoints')
    .addTag('analytics', 'Analytics and dashboard endpoints')
    .addTag('tenants', 'Tenant and branding configuration endpoints')
    .addTag('ai-config', 'AI configuration and automation rules endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
