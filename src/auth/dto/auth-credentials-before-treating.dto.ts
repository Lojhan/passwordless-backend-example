import {
  IsArray,
  IsNumber,
  MaxLength,
  MinLength,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  password: string[];

  @ApiProperty()
  remember: boolean | string;

  pushToken: string;
}
