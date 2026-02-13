import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProductPromptService } from './product-prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('api/v1/product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductPromptController {
  constructor(private readonly promptService: ProductPromptService) {}

  @Get(':productId/prompts')
  @Roles(UserRole.ORGANISATION)
  async getPrompts(
    @Param('productId') productId: number,
    @Req() req,
  ) {
    const tenantId = req.user.tenantId;
    return this.promptService.getPromptsByProduct(Number(productId), tenantId);
  }

  @Post(':productId/prompts')
  @Roles(UserRole.ORGANISATION)
  async createPrompt(
    @Param('productId') productId: number,
    @Body() dto: CreatePromptDto,
    @Req() req,
  ) {
    const tenantId = req.user.tenantId;
    const userId = req.user.sub;
    return this.promptService.createPrompt(Number(productId), tenantId, userId, dto);
  }

  @Patch('prompts/:promptId/deploy')
  @Roles(UserRole.ORGANISATION)
  async deployPrompt(
    @Param('promptId') promptId: number,
    @Req() req,
  ) {
    const tenantId = req.user.tenantId;
    return this.promptService.deployPrompt(Number(promptId), tenantId);
  }
}
