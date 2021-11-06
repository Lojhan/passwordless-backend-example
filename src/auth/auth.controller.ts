import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { TokenPayload } from './dto/token-payload.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from './roles.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';
import { GenerateTokenDTO } from './dto/generate-token-dto';
import { TransformTokenPipe } from 'src/pipes/transform-token.pipe';
import { SignInResponse } from './dto/sign-in-response.dto';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Generates a new user from given data' })
  signUp(
    @Body(ValidationPipe) authCredentialsDto: CreateUserDTO,
  ): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('generate-token')
  @ApiOperation({ summary: 'Generates a new temporary token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 401, description: 'Usuário não encontrado' })
  @ApiBody({ type: () => GenerateTokenDTO })
  generateToken(
    @Body(ValidationPipe) generateTokenDTO: GenerateTokenDTO,
  ): Promise<void> {
    return this.authService.generateToken(generateTokenDTO);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Logs user in' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: () => SignInResponse,
  })
  @ApiResponse({ status: 401 })
  signIn(
    @Body(ValidationPipe, TransformTokenPipe)
    authCredentialsDto: AuthCredentialsDTO,
  ): Promise<SignInResponse> {
    return this.authService.signIn(authCredentialsDto);
  }

  verify(@Body(ValidationPipe) token: TokenPayload): Promise<string> {
    return this.authService.verifyJwt(token.token);
  }

  @Get('verify')
  @Roles('adm', 'user')
  @UseGuards(AuthGuard(), RolesGuard)
  create(@Headers('Authorization') token: string) {
    return this.authService.verifyJwt(token);
  }
}
