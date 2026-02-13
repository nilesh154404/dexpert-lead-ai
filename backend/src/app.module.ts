import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantsModule } from './tenants/tenants.module';
import { AiConfigModule } from './ai-config/ai-config.module';
import { DatabaseConfigService } from './database/database-config.service';
import { PublicGuard } from './auth/guards/public.guard';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ProductModule } from './product/product.module';
import { ProductPromptModule } from './product-prompt/product-prompt.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    AuthModule,
    UsersModule,
    LeadsModule,
    AppointmentsModule,
    ConversationsModule,
    AnalyticsModule,
    TenantsModule,
    AiConfigModule,
  
    FileUploadModule,
    ProductModule,
    ProductPromptModule,
    // other modules,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PublicGuard,
    },
  ],
})
export class AppModule {}
