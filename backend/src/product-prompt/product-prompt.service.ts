// import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Prompt } from './product-prompt.entity';
// import { CreatePromptDto } from './dto/create-prompt.dto';
// import { Product } from '../entities/product.entity';

// @Injectable()
// export class PromptService {
//   constructor(
//     @InjectRepository(Prompt)
//     private promptRepo: Repository<Prompt>,
//     @InjectRepository(Product)
//     private productRepo: Repository<Product>,
//   ) {}

//   async getProductsForTenant(tenantId: string) {
//     return this.productRepo.find({ where: { tenant_id: tenantId } });
//   }

//   async getPromptVersions(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);
//     return this.promptRepo.find({
//       where: { product_id: productId, tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async getLatestPrompt(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);
//     return this.promptRepo.findOne({
//       where: { product_id: productId, tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async createPrompt(
//     productId: number,
//     tenantId: string,
//     createdBy: string,
//     dto: CreatePromptDto,
//   ) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);
//     const prompt = this.promptRepo.create({
//       product_id: productId,
//       tenant_id: tenantId,
//       prompt_text: dto.prompt_text,
//       version: dto.version,
//       created_by: createdBy,
//     });
//     return this.promptRepo.save(prompt);
//   }

//   private async ensureProductBelongsToTenant(productId: number, tenantId: string) {
//     const product = await this.productRepo.findOne({ where: { id: productId, tenant_id: tenantId } });
//     if (!product) throw new ForbiddenException('Access denied: Product does not belong to tenant');
//   }
// }

// import { Injectable, ForbiddenException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Prompt } from './product-prompt.entity';
// import { CreatePromptDto } from './dto/create-prompt.dto';
// import { Product } from '../entities/product.entity';

// @Injectable()
// export class PromptService {
//   constructor(
//     @InjectRepository(Prompt)
//     private readonly promptRepo: Repository<Prompt>,

//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,
//   ) {}

//   async getProductsForTenant(tenantId: string) {
//     if (!tenantId) {
//       throw new ForbiddenException('Tenant missing in token');
//     }

//     return this.productRepo.find({
//       where: { tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async getPromptVersions(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     return this.promptRepo.find({
//       where: { product_id: productId, tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async getLatestPrompt(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     return this.promptRepo.findOne({
//       where: { product_id: productId, tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async createPrompt(
//     productId: number,
//     tenantId: string,
//     createdBy: string,
//     dto: CreatePromptDto,
//   ) {
//     if (!createdBy) {
//       throw new ForbiddenException('User identity missing');
//     }

//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     const prompt = this.promptRepo.create({
//       product_id: productId,
//       tenant_id: tenantId,
//       prompt_text: dto.prompt_text,
//       version: dto.version,
//       created_by: createdBy,
//     });

//     return this.promptRepo.save(prompt);
//   }

//   private async ensureProductBelongsToTenant(
//     productId: number,
//     tenantId: string,
//   ) {
//     const product = await this.productRepo.findOne({
//       where: { id: productId, tenant_id: tenantId },
//     });

//     if (!product) {
//       throw new ForbiddenException(
//         'Access denied: Product does not belong to tenant',
//       );
//     }
//   }
// }


// import {
//   Injectable,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { Prompt } from './product-prompt.entity';
// import { Product } from '../entities/product.entity';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @Injectable()
// export class PromptService {
//   constructor(
//     @InjectRepository(Prompt)
//     private readonly promptRepo: Repository<Prompt>,

//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,
//   ) {}

//   // ✅ List products for tenant
//   async getProductsForTenant(tenantId: string) {
//     return this.productRepo.find({
//       where: { tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   // ✅ List all versions
//   async getPromptVersions(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     return this.promptRepo.find({
//       where: { product_id: productId, tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   // ✅ Latest version
//   async getLatestPrompt(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     return this.promptRepo.findOne({
//       where: { product_id: productId, tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   // ✅ Create new version
//   async createPrompt(
//     productId: number,
//     tenantId: string,
//     createdBy: string,
//     dto: CreatePromptDto,
//   ) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     const prompt = this.promptRepo.create({
//       product_id: productId,
//       tenant_id: tenantId,
//       prompt_text: dto.prompt_text,
//       version: dto.version,
//       created_by: createdBy,
//     });

//     return this.promptRepo.save(prompt);
//   }

//   // 🔥 VERY IMPORTANT FIX
//   private async ensureProductBelongsToTenant(
//     productId: number,
//     tenantId: string,
//   ) {
//     if (!tenantId) {
//       throw new ForbiddenException('Tenant missing in token');
//     }

//     const product = await this.productRepo.findOne({
//       where: { id: productId },
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found');
//     }

//     if (product.tenant_id !== tenantId) {
//       throw new ForbiddenException(
//         'Access denied: Product does not belong to tenant',
//       );
//     }

//     return product;
//   }
// }  thsi is done boss
//-------------------------





import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Prompt } from './product-prompt.entity';
import { Product } from '../entities/product.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PromptService {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepo: Repository<Prompt>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly subscriptionService: SubscriptionService,
  ) {}

  // ================= PRODUCTS =================

  async getProductsForTenant(tenantId: string) {
    return this.productRepo.find({
      where: { tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
  }

  // ================= PROMPTS =================

  async getPromptVersions(productId: number, tenantId: string) {
    await this.ensureProductBelongsToTenant(productId, tenantId);

    return this.promptRepo.find({
      where: { product_id: productId, tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
  }

  async getLatestPrompt(productId: number, tenantId: string) {
    await this.ensureProductBelongsToTenant(productId, tenantId);

    return this.promptRepo.findOne({
      where: {
        product_id: productId,
        tenant_id: tenantId,
        is_production: true, // ✅ production prompt
      },
    });
  }

  async createPrompt(
    productId: number,
    tenantId: string,
    createdBy: string,
    dto: CreatePromptDto,
    adminId: string,
  ) {
    // Check plan limit
    const canCreate = await this.subscriptionService.canCreatePrompt(adminId);
    if (!canCreate) {
      throw new ForbiddenException('Prompt creation limit reached for your plan.');
    }

    await this.ensureProductBelongsToTenant(productId, tenantId);

    const prompt = this.promptRepo.create({
      product_id: productId,
      tenant_id: tenantId,
      prompt_text: dto.prompt_text,
      version: dto.version,
      created_by: createdBy,
      is_production: false, // ✅ new versions never production by default
    });

    const savedPrompt = await this.promptRepo.save(prompt);
    await this.subscriptionService.incrementPromptCreate(adminId);
    return savedPrompt;
  }

  // // ================= 🔥 DEPLOY TO PRODUCTION =================

  // async deployPromptVersion(
  //   productId: number,
  //   promptId: number,
  //   tenantId: string,
  // ) {
  //   await this.ensureProductBelongsToTenant(productId, tenantId);

  //   const prompt = await this.promptRepo.findOne({
  //     where: {
  //       prompt_id: promptId,
  //       product_id: productId,
  //       tenant_id: tenantId,
  //     },
  //   });

  //   if (!prompt) {
  //     throw new NotFoundException('Prompt version not found');
  //   }

  //   // 1️⃣ Remove production from all versions of this product
  //   await this.promptRepo.update(
  //     { product_id: productId, tenant_id: tenantId },
  //     { is_production: false },
  //   );

  //   // 2️⃣ Set selected version as production
  //   prompt.is_production = true;
  //   return this.promptRepo.save(prompt);
  // }

  
  // ================= 🔥 DEPLOY TO PRODUCTION =================

  async deployPromptVersion(
    productId: number,
    promptId: number,
    tenantId: string,
  ) {
    await this.ensureProductBelongsToTenant(productId, tenantId);

    const prompt = await this.promptRepo.findOne({
      where: {
        prompt_id: promptId,
        product_id: productId,
        tenant_id: tenantId,
      },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt version not found');
    }

    // 1️⃣ Remove production from all versions of this product
    await this.promptRepo.update(
      { product_id: productId, tenant_id: tenantId },
      { is_production: false },
    );

    // 2️⃣ Set selected version as production
    prompt.is_production = true;
    return this.promptRepo.save(prompt);
  }


  // ================= SECURITY =================

  private async ensureProductBelongsToTenant(
    productId: number,
    tenantId: string,
  ) {
    if (!tenantId) {
      throw new ForbiddenException('Tenant missing in token');
    }

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.tenant_id !== tenantId) {
      throw new ForbiddenException(
        'Access denied: Product does not belong to tenant',
      );
    }

    return product;



    
  }
}















//-----------------------------------------

// import {
//   Injectable,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Prompt } from './product-prompt.entity';
// import { CreatePromptDto } from './dto/create-prompt.dto';
// import { Product } from '../entities/product.entity';

// @Injectable()
// export class PromptService {
//   constructor(
//     @InjectRepository(Prompt)
//     private readonly promptRepo: Repository<Prompt>,

//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,
//   ) {}

//   async getProductsForTenant(tenantId: string) {
//     if (!tenantId) {
//       throw new ForbiddenException('Tenant missing in token');
//     }

//     return this.productRepo.find({
//       where: { tenant_id: tenantId },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async getPromptVersions(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     return this.promptRepo.find({
//       where: {
//         product_id: productId,
//         tenant_id: tenantId,
//       },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async getLatestPrompt(productId: number, tenantId: string) {
//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     return this.promptRepo.findOne({
//       where: {
//         product_id: productId,
//         tenant_id: tenantId,
//       },
//       order: { created_at: 'DESC' },
//     });
//   }

//   async createPrompt(
//     productId: number,
//     tenantId: string,
//     createdBy: string,
//     dto: CreatePromptDto,
//   ) {
//     if (!tenantId) {
//       throw new ForbiddenException('Tenant missing in token');
//     }

//     if (!createdBy) {
//       throw new ForbiddenException('User identity missing in token');
//     }

//     await this.ensureProductBelongsToTenant(productId, tenantId);

//     const prompt = this.promptRepo.create({
//       product_id: productId,
//       tenant_id: tenantId,
//       prompt_text: dto.prompt_text,
//       version: dto.version,
//       created_by: createdBy,
//     });

//     return this.promptRepo.save(prompt);
//   }

//   private async ensureProductBelongsToTenant(
//     productId: number,
//     tenantId: string,
//   ) {
//     const product = await this.productRepo.findOne({
//       where: {
//         id: productId,
//         tenant_id: tenantId,
//       },
//     });

//     if (!product) {
//       throw new ForbiddenException(
//         'Access denied: Product does not belong to tenant',
//       );
//     }
//   }
// }
