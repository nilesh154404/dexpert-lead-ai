// //   adminId: number;
// //   planId: number;
// //   startDate: Date;
// //   endDate: Date;
// // }
// import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
//   /**
//   @IsNumber()
//   @IsOptional()
//   adminId?: number;

//   @IsNumber()
//   @IsNotEmpty()
//   planId: number;
// }
// import { ApiProperty } from '@nestjs/swagger';

// import { ApiProperty } from '@nestjs/swagger';

// export class CreateAdminSubscriptionDto {
//   @ApiProperty({ example: 1 })
//   planId: number;
// }

import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminSubscriptionDto {
  @ApiProperty({ example: 6 })
  @IsInt()
  @IsPositive()
  planId: number;
}