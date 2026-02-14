// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString } from 'class-validator';

// export class CreatePromptDto {
//   @ApiProperty({ example: 'Full AI prompt text here' })
//   @IsNotEmpty()
//   @IsString()
//   prompt_text: string;

//   @ApiProperty({ example: 'v3' })
//   @IsNotEmpty()
//   @IsString()
//   version: string;
// // }
// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString } from 'class-validator';

// export class CreatePromptDto {
//   @ApiProperty({ example: 'Full AI prompt text here' })
//   @IsNotEmpty()
//   @IsString()
//   prompt_text: string;

//   @ApiProperty({ example: 'v1' })
//   @IsNotEmpty()
//   @IsString()
//   version: string;
// }


import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptDto {
  @ApiProperty({ example: 'Full AI prompt text here' })
  @IsNotEmpty()
  @IsString()
  prompt_text: string;

  @ApiProperty({ example: 'v1' })
  @IsNotEmpty()
  @IsString()
  version: string;
}
