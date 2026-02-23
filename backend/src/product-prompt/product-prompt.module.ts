// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Prompt } from './product-prompt.entity';
// import { PromptService } from './product-prompt.service';
// import { PromptController } from './product-prompt.controller';
// import { Product } from '../entities/product.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Prompt, Product])],
//   controllers: [PromptController],
//   providers: [PromptService],
//   exports: [PromptService],
// })
// export class ProductPromptModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Prompt } from './product-prompt.entity';
// import { PromptService } from './product-prompt.service';
// import { PromptController } from './product-prompt.controller';
// import { Product } from '../entities/product.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Prompt, Product])],
//   controllers: [PromptController],
//   providers: [PromptService],
// })
// export class ProductPromptModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { Prompt } from './product-prompt.entity';
// import { Product } from '../entities/product.entity';
// import { PromptService } from './product-prompt.service';
// import { PromptController } from './product-prompt.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([Prompt, Product])],
//   controllers: [PromptController],
//   providers: [PromptService],
// })
// export class ProductPromptModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Prompt } from './product-prompt.entity';
// import { PromptService } from './product-prompt.service';
// import { PromptController } from './product-prompt.controller';
// import { Product } from '../entities/product.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Prompt, Product]), // ✅ MUST include Prompt
//   ],
//   controllers: [PromptController],
//   providers: [PromptService],
// })
// export class ProductPromptModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Prompt } from './product-prompt.entity';
// import { PromptController } from './product-prompt.controller';
// import { PromptService } from './product-prompt.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([Prompt])],
//   controllers: [PromptController],
//   providers: [PromptService],
// })
// export class PromptModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PromptController } from './product-prompt.controller';
import { PromptService } from './product-prompt.service';
import { Prompt } from './product-prompt.entity';
import { Product } from '../entities/product.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prompt, Product]),
    SubscriptionModule,
  ],
  controllers: [PromptController],
  providers: [PromptService],
  exports: [PromptService], // optional but good practice
})
export class ProductPromptModule {} // ✅ THIS MUST EXIST
