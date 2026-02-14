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

//working best this
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
// @ApiBearerAuth('JWT-auth') // 🔑 MUST MATCH Swagger name
// @Controller('product')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ORGANISATION)
// export class ProductController {
//   constructor(
//     private readonly productService: ProductService,
//   ) {}

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
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Param,
//   Body,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// import { ProductService } from './product.service';
// import { UpdateProductDto } from './dto/update-product.dto';

// @ApiTags('Product')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('product')
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   /* ---------------- MY PRODUCTS ---------------- */
//   @Get('my-products')
//   @Roles(UserRole.ORGANISATION)
//   getMyProducts(@Req() req: any) {
//     return this.productService.getMyProducts(req.user.tenantId);
//   }

//   /* ---------------- UPDATE PRODUCT ---------------- */
//   @Patch(':id')
//   @Roles(UserRole.ORGANISATION)
//   updateProduct(
//     @Param('id') id: number,
//     @Body() dto: UpdateProductDto,
//     @Req() req: any,
//   ) {
//     return this.productService.updateProduct(
//       id,
//       req.user.tenantId,
//       dto,
//     );
//   }

//   /* ---------------- DELETE PRODUCT ---------------- */
//   @Delete(':id')
//   @Roles(UserRole.ORGANISATION)
//   deleteProduct(
//     @Param('id') id: number,
//     @Req() req: any,
//   ) {
//     return this.productService.deleteProduct(
//       id,
//       req.user.tenantId,
//     );
//   }
// }

// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Param,
//   Body,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// import { ProductService } from './product.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';

// @ApiTags('Product')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('product')
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   /* ---------------- CREATE PRODUCT ---------------- */
//   @Post('create')
//   @Roles(UserRole.ORGANISATION)
//   createProduct(
//     @Body() dto: CreateProductDto,
//     @Req() req: any,
//   ) {
//     return this.productService.createProduct(
//       dto,
//       req.user.tenantId,
//     );
//   }

//   /* ---------------- GET MY PRODUCTS ---------------- */
//   @Get('my-products')
//   @Roles(UserRole.ORGANISATION)
//   getMyProducts(@Req() req: any) {
//     return this.productService.getMyProducts(req.user.tenantId);
//   }

//   /* ---------------- UPDATE PRODUCT ---------------- */
//   @Patch(':id')
//   @Roles(UserRole.ORGANISATION)
//   updateProduct(
//     @Param('id') id: number,
//     @Body() dto: UpdateProductDto,
//     @Req() req: any,
//   ) {
//     return this.productService.updateProduct(
//       id,
//       req.user.tenantId,
//       dto,
//     );
//   }

//   /* ---------------- DELETE PRODUCT ---------------- */
//   @Delete(':id')
//   @Roles(UserRole.ORGANISATION)
//   deleteProduct(
//     @Param('id') id: number,
//     @Req() req: any,
//   ) {
//     return this.productService.deleteProduct(
//       id,
//       req.user.tenantId,
//     );
//   }
// }


import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /* ================= CREATE ================= */
  @Post('create')
  @Roles(UserRole.ORGANISATION)
  createProduct(
    @Body() dto: CreateProductDto,
    @Req() req: any,
  ) {
    return this.productService.createProduct(
      dto,
      req.user.tenantId,
    );
  }

  /* ================= GET ================= */
  @Get('my-products')
  @Roles(UserRole.ORGANISATION)
  getMyProducts(@Req() req: any) {
    return this.productService.getMyProducts(
      req.user.tenantId,
    );
  }

  /* ================= UPDATE NAME / DESCRIPTION ================= */
  @Patch(':id')
  @Roles(UserRole.ORGANISATION)
  updateProduct(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productService.updateProduct(
      id,
      req.user.tenantId,
      dto,
    );
  }

  /* ================= STATUS TOGGLE ================= */
  @Patch(':id/status')
  @Roles(UserRole.ORGANISATION)
  updateProductStatus(
    @Param('id') id: number,
    @Body('is_active') is_active: boolean,
    @Req() req: any,
  ) {
    return this.productService.updateProductStatus(
      id,
      req.user.tenantId,
      is_active,
    );
  }

  /* ================= DELETE ================= */
  @Delete(':id')
  @Roles(UserRole.ORGANISATION)
  deleteProduct(
    @Param('id') id: number,
    @Req() req: any,
  ) {
    return this.productService.deleteProduct(
      id,
      req.user.tenantId,
    );
  }
}
