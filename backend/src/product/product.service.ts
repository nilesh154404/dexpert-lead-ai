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
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Prompt)
    private readonly promptRepo: Repository<Prompt>,

    private readonly subscriptionService: SubscriptionService,
  ) {}

  /* ================= CREATE ================= */
  async createProduct(
    dto: CreateProductDto,
    tenantId: string,
    adminId: string,
  ) {
    // Check plan limit
    const canCreate = await this.subscriptionService.canCreateProduct(adminId);
    if (!canCreate) {
      throw new ForbiddenException('You must subscribe to a plan before you can create products.');
    }

    const product = this.productRepo.create({
      product_name: dto.product_name,
      description: dto.description ?? null,
      display_order: dto.display_order ?? 0,
      tenant_id: tenantId,
      is_active: true,
    });

    const savedProduct = await this.productRepo.save(product);
    await this.subscriptionService.incrementProductCreate(adminId);
    return savedProduct;
  }

  /* ================= GET ================= */
  getMyProducts(tenantId: string) {
    return this.productRepo.find({
      where: { tenant_id: tenantId },
      order: { display_order: 'ASC', created_at: 'DESC' },
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
    adminId: string,
  ) {
    // Check plan edit limit
    const subscription = await this.subscriptionService.getAdminSubscription(adminId);
    if (!subscription) {
      throw new ForbiddenException('No active subscription found.');
    }
    const usage = await this.subscriptionService.getUsageForSubscription(subscription.id);
    const limit = subscription.plan.productEditLimit;
    if (limit !== -1 && usage.productEdited >= limit) {
      throw new ForbiddenException('Product edit limit reached for your plan. Upgrade your plan to edit more products.');
    }

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

    if (dto.display_order !== undefined) {
      product.display_order = dto.display_order;
    }

    const savedProduct = await this.productRepo.save(product);
    usage.productEdited += 1;
    await this.subscriptionService.saveUsage(usage);
    return savedProduct;
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
