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


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createProduct(data: {
    product_name: string;
    tenant_id: string;
    created_by: string;
  }) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async getMyProducts(tenant_id: string) {
    return this.productRepo.find({
      where: { tenant_id },
      order: { created_at: 'DESC' },
    });
  }
}
