import { IsString, IsEmail } from 'class-validator';
export class GenerateTokenDTO {
  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // @ApiProperty()
  // username: string;

  @IsEmail()
  email: string;

  @IsString()
  method: 'push' | 'mail' = 'mail';
}
