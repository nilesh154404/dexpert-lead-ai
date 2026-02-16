// import { IsString } from 'class-validator';

// export class ChatAuthDto {
//   @IsString()
//   conversation_id: string;

//   @IsString()
//   tenant_id: string;

//   @IsString()
//   message: string;
// }
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class ChatAuthDto {
  @IsUUID()
  conversationId: string;

  @IsUUID()
  tenantId: string;

  @IsString()
  message: string;

  @IsOptional()
  aiInsightType?: 'intent' | 'sentiment' | 'topic' | 'objection';

  @IsOptional()
  aiInsightLabel?: string;

  @IsOptional()
  aiInsightConfidence?: number;
}
