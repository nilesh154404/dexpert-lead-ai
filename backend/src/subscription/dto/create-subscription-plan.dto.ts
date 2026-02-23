import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  durationMonths: number;

  @ApiProperty()
  @IsNumber()
  productCreateLimit: number;

  @ApiProperty()
  @IsNumber()
  productEditLimit: number;

  @ApiProperty()
  @IsNumber()
  promptCreateLimit: number;

  @ApiProperty()
  @IsNumber()
  promptEditLimit: number;
}
