// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Product } from '../entities/product.entity';
// import { ProductService } from './product.service';
// import { ProductController } from './product.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([Product])],
//   providers: [ProductService],
//   controllers: [ProductController],
//   exports: [ProductService],
// })
// export class ProductModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Product } from '../entities/product.entity';
// import { ProductService } from './product.service';
// import { ProductController } from './product.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([Product])],
//   providers: [ProductService],
//   controllers: [ProductController],
// })
// export class ProductModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../entities/product.entity';
import { Prompt } from '../product-prompt/product-prompt.entity';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Prompt])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
