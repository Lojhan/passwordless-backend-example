import {
  IsEmail,
  IsPhoneNumber,
  IsISO8601,
  IsLocale,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  profilePicture?: File;

  @IsISO8601()
  @ApiProperty()
  birthDate: Date;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsLocale()
  @ApiProperty()
  region: string;
}
