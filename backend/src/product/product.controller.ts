// import { Controller, Post, Body, Get, Query, UseGuards, Req } from '@nestjs/common';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { ProductService } from './product.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';


// @ApiTags('product')
// @Controller('product')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ORGANISATION)
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post('create')
//   @ApiOperation({ summary: 'Create a new product' })
//   async createProduct(
//     @Req() req,
//     @Body('product_name') product_name: string,
//   ) {
//     // tenant_id and user_id (sub) from JWT
//     const tenant_id = req.user.tenantId;
//     const created_by = req.user.sub;
//     return this.productService.create(tenant_id, created_by, product_name);
//   }

//   @Get('my-products')
//   @ApiOperation({ summary: 'Get products for current tenant' })
//   async getMyProducts(@Req() req) {
//     const tenant_id = req.user.tenantId;
//     return this.productService.findAllByTenant(tenant_id);
//   }
// }



// import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
// import { ProductService } from './product.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// @Controller('product')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ORGANISATION)
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post('create')
//   createProduct(
//     @Req() req,
//     @Body('product_name') product_name: string,
//   ) {
//     return this.productService.createProduct({
//       product_name,
//       tenant_id: req.user.tenantId, 
//       created_by: req.user.sub,     
//     });
//   }

//   @Get('my-products')
//   getMyProducts(@Req() req) {
//     return this.productService.getMyProducts(req.user.tenantId);
//   }
// }


// import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
// import { ProductService } from './product.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';
// import { CreateProductDto } from './dto/create-product.dto';

// @ApiTags('product')
// @ApiBearerAuth('access-token')
// @Controller('product')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ORGANISATION)
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post('create')
//   @ApiBody({ type: CreateProductDto })
//   createProduct(
//     @Req() req: any,
//     @Body() dto: CreateProductDto,
//   ) {
//     return this.productService.createProduct({
//       product_name: dto.product_name,
//       tenant_id: req.user.tenantId,
//       created_by: req.user.sub,
//     });
//   }

//   @Get('my-products')
//   getMyProducts(@Req() req: any) {
//     return this.productService.getMyProducts(req.user.tenantId);
//   }
// }

// import {
//   Controller,
//   Post,
//   Get,
//   Body,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiBearerAuth,
//   ApiBody,
// } from '@nestjs/swagger';
// import { ProductService } from './product.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';
// import { CreateProductDto } from './dto/create-product.dto';

// @ApiTags('product')
// @ApiBearerAuth('access-token') 
// @Controller('product')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ORGANISATION)
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post('create')
//   @ApiBody({ type: CreateProductDto })
//   createProduct(@Req() req: any, @Body() dto: CreateProductDto) {
//     return this.productService.createProduct({
//       product_name: dto.product_name,
//       tenant_id: req.user.tenantId,
//       created_by: req.user.sub,
//     });
//   }

//   @Get('my-products')
//   getMyProducts(@Req() req: any) {
//     return this.productService.getMyProducts(req.user.tenantId);
//   }
// }


import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { ProductService } from './product.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '../entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('product')
@ApiBearerAuth('JWT-auth') // 🔑 MUST MATCH Swagger name
@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ORGANISATION)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post('create')
  @ApiBody({ type: CreateProductDto })
  createProduct(
    @Req() req: any,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.createProduct({
      product_name: dto.product_name,
      tenant_id: req.user.tenantId,
      created_by: req.user.sub,
    });
  }

  @Get('my-products')
  getMyProducts(@Req() req: any) {
    return this.productService.getMyProducts(req.user.tenantId);
  }
}
