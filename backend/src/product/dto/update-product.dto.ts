import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateProductDto {
  @ApiProperty({ example: 'CRM Tool Pro' })
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @ApiPropertyOptional({
    example: 'Updated product description',
  })
  @IsOptional()
  @IsString()
  description?: string;


  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
