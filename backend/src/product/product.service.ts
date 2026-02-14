// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from '../entities/product.entity';

// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private productRepository: Repository<Product>,
//   ) {}

//   async create(tenant_id: string, created_by: string, product_name: string): Promise<Product> {
//     const product = this.productRepository.create({ tenant_id, created_by, product_name });
//     return this.productRepository.save(product);
//   }

//   async findAllByTenant(tenant_id: string): Promise<Product[]> {
//     return this.productRepository.find({ where: { tenant_id } });
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from '../entities/product.entity';

// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,
//   ) {}

//   async createProduct(data: {
//     product_name: string;
//     tenant_id: string;
//     created_by: string;
//   }) {
//     const product = this.productRepo.create(data);
//     return this.productRepo.save(product);
//   }

//   async getMyProducts(tenant_id: string) {
//     return this.productRepo.find({
//       where: { tenant_id },
//       order: { created_at: 'DESC' },
//     });
//   }
// }


// import {
//   Injectable,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { Product } from '../entities/product.entity';
// import { Prompt } from '../product-prompt/product-prompt.entity';
// import { UpdateProductDto } from './dto/update-product.dto';

// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private productRepo: Repository<Product>,

//     @InjectRepository(Prompt)
//     private promptRepo: Repository<Prompt>,
//   ) {}

//   /* ---------------- GET ---------------- */
//   getMyProducts(tenantId: string) {
//     return this.productRepo.find({
//       where: { tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   /* ---------------- UPDATE ---------------- */
//   async updateProduct(
//     productId: number,
//     tenantId: string,
//     dto: UpdateProductDto,
//   ) {
//     const product = await this.productRepo.findOne({
//       where: { id: productId, tenant_id: tenantId },
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found');
//     }

//     product.product_name = dto.product_name;
//     return this.productRepo.save(product);
//   }

//   /* ---------------- DELETE ---------------- */
//   async deleteProduct(productId: number, tenantId: string) {
//     const product = await this.productRepo.findOne({
//       where: { id: productId, tenant_id: tenantId },
//     });

//     if (!product) {
//       throw new ForbiddenException(
//         'You cannot delete this product',
//       );
//     }

//     // 🔥 Delete prompts first (safe)
//     await this.promptRepo.delete({
//       product_id: productId,
//       tenant_id: tenantId,
//     });

//     await this.productRepo.delete(productId);

//     return { message: 'Product deleted successfully' };
//   }
// }


// import {
//   Injectable,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { Product } from '../entities/product.entity';
// import { Prompt } from '../product-prompt/product-prompt.entity';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';

// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private productRepo: Repository<Product>,

//     @InjectRepository(Prompt)
//     private promptRepo: Repository<Prompt>,
//   ) {}

//   /* ---------------- CREATE ---------------- */
//   async createProduct(
//     dto: CreateProductDto,
//     tenantId: string,
//   ) {
//     const product = this.productRepo.create({
//       product_name: dto.product_name,
//       description: dto.description,
//       tenant_id: tenantId,
//       is_active: true,
//     });

//     return this.productRepo.save(product);
//   }

//   /* ---------------- GET ---------------- */
//   getMyProducts(tenantId: string) {
//     return this.productRepo.find({
//       where: { tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   /* ---------------- UPDATE ---------------- */
//   async updateProduct(
//     productId: number,
//     tenantId: string,
//     dto: UpdateProductDto,
//   ) {
//     const product = await this.productRepo.findOne({
//       where: { id: productId, tenant_id: tenantId },
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found');
//     }

//     product.product_name = dto.product_name;
//     return this.productRepo.save(product);
//   }

//   /* ---------------- DELETE ---------------- */
//   async deleteProduct(
//     productId: number,
//     tenantId: string,
//   ) {
//     const product = await this.productRepo.findOne({
//       where: { id: productId, tenant_id: tenantId },
//     });

//     if (!product) {
//       throw new ForbiddenException(
//         'You cannot delete this product',
//       );
//     }
    

//     // delete prompts first
//     await this.promptRepo.delete({
//       product_id: productId,
//       tenant_id: tenantId,
//     });

//     await this.productRepo.delete(productId);

//     return { message: 'Product deleted successfully' };
//   }
// }


import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { Prompt } from '../product-prompt/product-prompt.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Prompt)
    private readonly promptRepo: Repository<Prompt>,
  ) {}

  /* ================= CREATE ================= */
  async createProduct(
    dto: CreateProductDto,
    tenantId: string,
  ) {
    const product = this.productRepo.create({
      product_name: dto.product_name,
      description: dto.description ?? null,
      tenant_id: tenantId,
      is_active: true,
    });

    return this.productRepo.save(product);
  }

  /* ================= GET ================= */
  getMyProducts(tenantId: string) {
    return this.productRepo.find({
      where: { tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
  }

  /* ================= UPDATE (NAME / DESCRIPTION) ================= */
  // async updateProduct(
  //   productId: number,
  //   tenantId: string,
  //   dto: UpdateProductDto,
  // ) {
  //   const product = await this.productRepo.findOne({
  //     where: { id: productId, tenant_id: tenantId },
  //   });

  //   if (!product) {
  //     throw new NotFoundException('Product not found');
  //   }

  //   // update only provided fields
  //   if (dto.product_name !== undefined) {
  //     product.product_name = dto.product_name;
  //   }

  //   if (dto.description !== undefined) {
  //     product.description = dto.description;
  //   }

  //   return this.productRepo.save(product);
  // }

  async updateProduct(
  productId: number,
  tenantId: string,
  dto: UpdateProductDto,
) {
  const product = await this.productRepo.findOne({
    where: { id: productId, tenant_id: tenantId },
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  if (dto.product_name !== undefined) {
    product.product_name = dto.product_name;
  }

  if (dto.description !== undefined) {
    product.description = dto.description;
  }

  if (dto.is_active !== undefined) {
    product.is_active = dto.is_active; // 🔥 FIX
  }

  return this.productRepo.save(product);
}


  /* ================= STATUS TOGGLE ================= */
  async updateProductStatus(
    productId: number,
    tenantId: string,
    is_active: boolean,
  ) {
    const product = await this.productRepo.findOne({
      where: { id: productId, tenant_id: tenantId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.is_active = is_active;
    return this.productRepo.save(product);
  }

  /* ================= DELETE ================= */
  async deleteProduct(
    productId: number,
    tenantId: string,
  ) {
    const product = await this.productRepo.findOne({
      where: { id: productId, tenant_id: tenantId },
    });

    if (!product) {
      throw new ForbiddenException(
        'You cannot delete this product',
      );
    }

    // delete all prompts of this product first
    await this.promptRepo.delete({
      product_id: productId,
      tenant_id: tenantId,
    });

    await this.productRepo.delete(productId);

    return { message: 'Product deleted successfully' };
  }
}
