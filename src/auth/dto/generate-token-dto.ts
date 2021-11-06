import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, IsString } from 'class-validator';

export class GenerateTokenDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;
}
