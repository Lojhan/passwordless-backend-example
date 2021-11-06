import { CreateUserDTO } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
  @ApiProperty()
  user: CreateUserDTO;
  @ApiProperty()
  token: string;
}
