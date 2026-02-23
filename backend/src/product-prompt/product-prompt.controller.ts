// import {
//   Controller, Get, Post, Param, Body, UseGuards, Request,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';
// import { PromptService } from './product-prompt.service';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @ApiBearerAuth()
// @ApiTags('Prompt')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('prompt')
// export class PromptController {
//   constructor(private readonly promptService: PromptService) {}

//   @Get('products')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all products for tenant' })
//   @ApiResponse({ status: 200, description: 'List of products' })
//   async getProducts(@Request() req) {
//     const tenantId = req.user.tenant_id;
//     return this.promptService.getProductsForTenant(tenantId);
//   }

//   @Get(':productId/versions')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all prompt versions for a product' })
//   @ApiResponse({ status: 200, description: 'List of prompt versions' })
//   async getPromptVersions(@Param('productId') productId: number, @Request() req) {
//     const tenantId = req.user.tenant_id;
//     return this.promptService.getPromptVersions(productId, tenantId);
//   }

//   @Get(':productId/latest')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get latest prompt for a product' })
//   @ApiResponse({ status: 200, description: 'Latest prompt version' })
//   async getLatestPrompt(@Param('productId') productId: number, @Request() req) {
//     const tenantId = req.user.tenant_id;
//     return this.promptService.getLatestPrompt(productId, tenantId);
//   }

//   @Post(':productId')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Create/save prompt (new version)' })
//   @ApiResponse({ status: 201, description: 'Prompt created' })
//   async createPrompt(
//     @Param('productId') productId: number,
//     @Body() dto: CreatePromptDto,
//     @Request() req,
//   ) {
//     const tenantId = req.user.tenant_id;
//     const createdBy = req.user.org_name || req.user.tenant_name || 'unknown';
//     return this.promptService.createPrompt(productId, tenantId, createdBy, dto);
//   }
// }


// import {
//   Controller,
//   Get,
//   Post,
//   Param,
//   Body,
//   UseGuards,
//   Request,
// } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
// } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';
// import { PromptService } from './product-prompt.service';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @ApiTags('Prompt')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('api/v1/prompt')
// export class PromptController {
//   constructor(private readonly promptService: PromptService) {}

//   @Get('products')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all products for tenant' })
//   async getProducts(@Request() req) {
//     const tenantId = req.user.tenantId; // ✅ FIX
//     return this.promptService.getProductsForTenant(tenantId);
//   }

//   @Get(':productId/versions')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all prompt versions for a product' })
//   async getPromptVersions(
//     @Param('productId') productId: number,
//     @Request() req,
//   ) {
//     const tenantId = req.user.tenantId; // ✅ FIX
//     return this.promptService.getPromptVersions(productId, tenantId);
//   }

//   @Get(':productId/latest')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get latest prompt for a product' })
//   async getLatestPrompt(
//     @Param('productId') productId: number,
//     @Request() req,
//   ) {
//     const tenantId = req.user.tenantId; // ✅ FIX
//     return this.promptService.getLatestPrompt(productId, tenantId);
//   }

//   @Post(':productId')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Create/save prompt (new version)' })
//   async createPrompt(
//     @Param('productId') productId: number,
//     @Body() dto: CreatePromptDto,
//     @Request() req,
//   ) {
//     const tenantId = req.user.tenantId; // ✅ FIX
//     const createdBy = req.user.email;   // ✅ SAFE FIELD
//     return this.promptService.createPrompt(
//       productId,
//       tenantId,
//       createdBy,
//       dto,
//     );
//   }
// }

// import {
//   Controller,
//   Get,
//   Post,
//   Param,
//   Body,
//   UseGuards,
//   Req,
// } from '@nestjs/common';

// import {
//   ApiBearerAuth,
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
// } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// import { PromptService } from './product-prompt.service';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @ApiTags('Prompt')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('prompt')
// export class PromptController {
//   constructor(private readonly promptService: PromptService) {}

//   // ✅ Get all products for tenant
//   @Get('products')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all products for tenant' })
//   @ApiResponse({ status: 200 })
//   async getProducts(@Req() req: any) {
//     return this.promptService.getProductsForTenant(req.user.tenant_id);
//   }

//   // ✅ Get all versions of a product prompt
//   @Get(':productId/versions')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all prompt versions for a product' })
//   @ApiResponse({ status: 200 })
//   async getPromptVersions(
//     @Param('productId') productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getPromptVersions(
//       Number(productId),
//       req.user.tenant_id,
//     );
//   }

//   // ✅ Get latest prompt
//   @Get(':productId/latest')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get latest prompt for a product' })
//   @ApiResponse({ status: 200 })
//   async getLatestPrompt(
//     @Param('productId') productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getLatestPrompt(
//       Number(productId),
//       req.user.tenant_id,
//     );
//   }

//   // ✅ Create new prompt version
//   @Post(':productId')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Create/save prompt (new version)' })
//   @ApiResponse({ status: 201 })
//   async createPrompt(
//     @Param('productId') productId: number,
//     @Body() dto: CreatePromptDto,
//     @Req() req: any,
//   ) {
//     const createdBy =
//       req.user.org_name || req.user.tenant_name || req.user.email;

//     return this.promptService.createPrompt(
//       Number(productId),
//       req.user.tenant_id,
//       createdBy,
//       dto,
//     );
//   }
// }




// import {
//   Controller,
//   Get,
//   Post,
//   Param,
//   Body,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
// } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// import { PromptService } from './product-prompt.service';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @ApiTags('Prompt')
// @ApiBearerAuth('JWT-auth') // ✅ MUST MATCH main.ts
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('prompt')
// export class PromptController {
//   constructor(private readonly promptService: PromptService) {}

//   @Get('products')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all products for tenant' })
//   @ApiResponse({ status: 200 })
//   async getProducts(@Req() req: any) {
//     const tenantId = req.user.tenantId;
//     return this.promptService.getProductsForTenant(tenantId);
//   }

//   @Get(':productId/versions')
//   @Roles(UserRole.ORGANISATION)
//   async getPromptVersions(
//     @Param('productId') productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getPromptVersions(
//       productId,
//       req.user.tenantId,
//     );
//   }

//   @Get(':productId/latest')
//   @Roles(UserRole.ORGANISATION)
//   async getLatestPrompt(
//     @Param('productId') productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getLatestPrompt(
//       productId,
//       req.user.tenantId,
//     );
//   }

//   @Post(':productId')
//   @Roles(UserRole.ORGANISATION)

  
//   async createPrompt(
//     @Param('productId') productId: number,
//     @Body() dto: CreatePromptDto,
//     @Req() req: any,
//   ) {
//     return this.promptService.createPrompt(
//       productId,
//       req.user.tenantId,
//       req.user.email,
//       dto,
//     );
//   }
// }


// import {
//   Controller,
//   Get,
//   Post,
//   Param,
//   Body,
//   UseGuards,
//   Req,
//   ParseIntPipe,
// } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
// } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// import { PromptService } from './product-prompt.service';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @ApiTags('Prompt')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('prompt')
// export class PromptController {
//   constructor(private readonly promptService: PromptService) {}

//   @Get('products')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Get all products for tenant' })
//   @ApiResponse({ status: 200 })
//   async getProducts(@Req() req: any) {
//     return this.promptService.getProductsForTenant(req.user.tenantId);
//   }

//   @Get(':productId/versions')
//   @Roles(UserRole.ORGANISATION)
//   async getPromptVersions(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getPromptVersions(
//       productId,
//       req.user.tenantId,
//     );
//   }

//   @Get(':productId/latest')
//   @Roles(UserRole.ORGANISATION)
//   async getLatestPrompt(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getLatestPrompt(
//       productId,
//       req.user.tenantId,
//     );
//   }

//   @Post(':productId')
//   @Roles(UserRole.ORGANISATION)
//   @ApiOperation({ summary: 'Create/save prompt (new version)' })
//   @ApiResponse({ status: 201 })
//   async createPrompt(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Body() dto: CreatePromptDto,
//     @Req() req: any,
//   ) {
//     return this.promptService.createPrompt(
//       productId,
//       req.user.tenantId,
//       req.user.email, // ✅ SAFE & EXISTS IN JWT
//       dto,
//     );
//   }
// }


// import {
//   Controller,
//   Get,
//   Post,
//   Param,
//   Body,
//   UseGuards,
//   Req,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../entities/user.entity';

// import { PromptService } from './product-prompt.service';
// import { CreatePromptDto } from './dto/create-prompt.dto';

// @ApiTags('Prompt')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('prompt')
// export class PromptController {
//   constructor(private readonly promptService: PromptService) {}

//   @Get('products')
//   @Roles(UserRole.ORGANISATION)
//   getProducts(@Req() req: any) {
//     return this.promptService.getProductsForTenant(req.user.tenantId);
//   }

//   @Get(':productId/versions')
//   @Roles(UserRole.ORGANISATION)
//   getPromptVersions(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getPromptVersions(
//       productId,
//       req.user.tenantId,
//     );
//   }

//   @Get(':productId/latest')
//   @Roles(UserRole.ORGANISATION)
//   getLatestPrompt(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Req() req: any,
//   ) {
//     return this.promptService.getLatestPrompt(
//       productId,
//       req.user.tenantId,
//     );
//   }

//   @Post(':productId')
//   @Roles(UserRole.ORGANISATION)
//   createPrompt(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Body() dto: CreatePromptDto,
//     @Req() req: any,
//   ) {
//     return this.promptService.createPrompt(
//       productId,
//       req.user.tenantId,
//       req.user.email,
//       dto,
//     );
//   }
// }


import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

import { PromptService } from './product-prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';

@ApiTags('Prompt')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Get('products')
  @Roles(UserRole.ORGANISATION)
  @ApiOperation({ summary: 'Get all products for tenant' })
  @ApiResponse({ status: 200 })
  async getProducts(@Req() req: any) {
    return this.promptService.getProductsForTenant(req.user.tenantId);
  }

  @Get(':productId/versions')
  @Roles(UserRole.ORGANISATION)
  async getPromptVersions(
    @Param('productId') productId: number,
    @Req() req: any,
  ) {
    return this.promptService.getPromptVersions(
      Number(productId),
      req.user.tenantId,
    );
  }

  @Get(':productId/latest')
  @Roles(UserRole.ORGANISATION)
  async getLatestPrompt(
    @Param('productId') productId: number,
    @Req() req: any,
  ) {
    return this.promptService.getLatestPrompt(
      Number(productId),
      req.user.tenantId,
    );
  }
  @Post(':productId/prompts/:promptId/deploy')
@Roles(UserRole.ORGANISATION)
deployPrompt(
  @Param('productId') productId: number,
  @Param('promptId') promptId: number,
  @Req() req,
) {
  return this.promptService.deployPromptVersion(
    productId,
    promptId,
    req.user.tenantId,
  );
}


  @Post(':productId')
  @Roles(UserRole.ORGANISATION)
  async createPrompt(
    @Param('productId') productId: number,
    @Body() dto: CreatePromptDto,
    @Req() req: any,
  ) {
    return this.promptService.createPrompt(
      Number(productId),
      req.user.tenantId,
      req.user.email || 'organisation',
      dto,
      req.user.sub,
    );
  }
}
