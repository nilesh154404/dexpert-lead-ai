import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPrompt } from './product-prompt.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductPromptService {
  constructor(
    @InjectRepository(ProductPrompt)
    private promptRepo: Repository<ProductPrompt>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async getPromptsByProduct(productId: number, tenantId: string) {
    // Ensure product belongs to tenant
    const product = await this.productRepo.findOne({
      where: { id: productId, tenant_id: tenantId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.promptRepo.find({
      where: { productId, tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async createPrompt(
    productId: number,
    tenantId: string,
    userId: string,
    dto: CreatePromptDto,
  ) {
    // Ensure product belongs to tenant
    const product = await this.productRepo.findOne({
      where: { id: productId, tenant_id: tenantId },
    });
    if (!product) throw new NotFoundException('Product not found');
    const prompt = this.promptRepo.create({
      productId,
      tenantId,
      text: dto.text,
      version: dto.version,
      isActive: false,
      createdBy: userId,
    });
    return this.promptRepo.save(prompt);
  }

  async deployPrompt(promptId: number, tenantId: string) {
    const prompt = await this.promptRepo.findOne({
      where: { promptId, tenantId },
    });
    if (!prompt) throw new NotFoundException('Prompt not found');
    // Deactivate all prompts for this product
    await this.promptRepo.update(
      { productId: prompt.productId, tenantId: prompt.tenantId },
      { isActive: false },
    );
    // Activate selected prompt
    prompt.isActive = true;
    return this.promptRepo.save(prompt);
  }
}
