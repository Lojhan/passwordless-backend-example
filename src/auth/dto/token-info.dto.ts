import { ApiProperty } from '@nestjs/swagger';

export class TokenInfo {
  @ApiProperty()
  token: string;

  @ApiProperty()
  tokenValidation: Date;

  @ApiProperty()
  tokenUsed: boolean;
}
