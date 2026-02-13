import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPrompt } from './product-prompt.entity';
import { ProductPromptService } from './product-prompt.service';
import { ProductPromptController } from './product-prompt.controller';
import { Product } from '../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPrompt, Product])],
  controllers: [ProductPromptController],
  providers: [ProductPromptService],
  exports: [ProductPromptService],
})
export class ProductPromptModule {}
