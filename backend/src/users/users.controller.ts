// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
// } from '@nestjs/swagger';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { User } from '../entities/user.entity';

// @ApiTags('users')
// // @ApiBearerAuth('JWT-auth')
// // @UseGuards(JwtAuthGuard)grgregr
// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new user (admin only)' })
//   @ApiResponse({ status: 201, description: 'User successfully created' })
//   create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: User) {
//     return this.usersService.create(createUserDto, user.tenantId);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all users in the tenant' })
//   @ApiResponse({ status: 200, description: 'Returns list of users' })
//   findAll(@CurrentUser() user: User) {
//     return this.usersService.findAll(user.tenantId);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a user by ID' })
//   @ApiResponse({ status: 200, description: 'Returns the user' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   findOne(@Param('id') id: string, @CurrentUser() user: User) {
//     return this.usersService.findOne(id, user.tenantId);
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a user' })
//   @ApiResponse({ status: 200, description: 'User successfully updated' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   update(
//     @Param('id') id: string,
//     @Body() updateUserDto: UpdateUserDto,
//     @CurrentUser() user: User,
//   ) {
//     return this.usersService.update(id, updateUserDto, user.tenantId);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a user' })
//   @ApiResponse({ status: 200, description: 'User successfully deleted' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   remove(@Param('id') id: string, @CurrentUser() user: User) {
//     return this.usersService.remove(id, user.tenantId);
//   }
// }

// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   ForbiddenException,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
// } from '@nestjs/swagger';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { User } from '../entities/user.entity';
// import { UserRole } from '../entities/user.entity';

// @ApiTags('users')
// @ApiBearerAuth()                 // ✅ REQUIRED for Swagger to send JWT
// @UseGuards(JwtAuthGuard)         // ✅ REQUIRED for @CurrentUser()
// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   // ---------------- CREATE USER ----------------
//   @Post()
//   @ApiOperation({ summary: 'Create a new user (organisation admin only)' })
//   @ApiResponse({ status: 201, description: 'User successfully created' })
//   create(
//     @Body() createUserDto: CreateUserDto,
//     @CurrentUser() user: User,
//   ) {
//     // ✅ Role protection (optional but correct)
//     if (
//       user.role !== UserRole.ORGANISATION &&
//       user.role !== UserRole.SUPER_ADMIN
//     ) {
//       throw new ForbiddenException(
//         'Only organisation admin can create users',
//       );
//     }

//     return this.usersService.create(createUserDto, user.tenantId);
//   }

//   // ---------------- GET ALL USERS ----------------
//   @Get()
//   @ApiOperation({ summary: 'Get all users in the tenant' })
//   @ApiResponse({ status: 200, description: 'Returns list of users' })
//   findAll(@CurrentUser() user: User) {
//     return this.usersService.findAll(user.tenantId);
//   }

//   // ---------------- GET USER BY ID ----------------
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a user by ID' })
//   @ApiResponse({ status: 200, description: 'Returns the user' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   findOne(
//     @Param('id') id: string,
//     @CurrentUser() user: User,
//   ) {
//     return this.usersService.findOne(id, user.tenantId);
//   }

//   // ---------------- UPDATE USER ----------------
//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a user' })
//   @ApiResponse({ status: 200, description: 'User successfully updated' })
//   update(
//     @Param('id') id: string,
//     @Body() updateUserDto: UpdateUserDto,
//     @CurrentUser() user: User,
//   ) {
//     return this.usersService.update(id, updateUserDto, user.tenantId);
//   }

//   // ---------------- DELETE USER ----------------
//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a user' })
//   @ApiResponse({ status: 200, description: 'User successfully deleted' })
//   remove(
//     @Param('id') id: string,
//     @CurrentUser() user: User,
//   ) {
//     return this.usersService.remove(id, user.tenantId);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.entity';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')     // ✅ MUST MATCH main.ts EXACTLY
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (organisation admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: User,
  ) {
    if (
      user.role !== UserRole.ORGANISATION &&
      user.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only organisation admin can create users',
      );
    }

    return this.usersService.create(createUserDto, user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users in the tenant' })
  @ApiResponse({ status: 200, description: 'Returns list of users' })
  findAll(@CurrentUser() user: User) {
    return this.usersService.findAll(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.remove(id, user.tenantId);
  }
}
