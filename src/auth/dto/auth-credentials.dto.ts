import { MaxLength, MinLength, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  remember: boolean;

  pushToken: string;
}
