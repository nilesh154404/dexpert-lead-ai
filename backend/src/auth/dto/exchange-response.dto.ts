export interface ExchangeResponseDto {
  access_token: string;
  expires_in: number; // seconds
  token_type: string;
  scopes: string[];
  tenantId: string;
}
