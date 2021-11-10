import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Put,
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
import { TransformBooleansPipe } from 'src/pipes/transform-booleans.pipe';
import { GetUser } from 'src/decorators/get-user.decorator';
import { TokenInfo } from './dto/token-info.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

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
  ): Promise<string> {
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
    @Body(ValidationPipe, TransformTokenPipe, TransformBooleansPipe)
    authCredentialsDto: AuthCredentialsDTO,
  ): Promise<SignInResponse> {
    console.log(authCredentialsDto);
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('token')
  @UseGuards(AuthGuard())
  getToken(@GetUser() user: User): TokenInfo {
    const { tokenUsed, tokenValidation, password } = user;
    return { token: password, tokenUsed, tokenValidation } as TokenInfo;
  }

  @Patch('update-user')
  @Put('update-user')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Updates user from given data' })
  updateUser(
    @GetUser() user: User,
    @Body(ValidationPipe) authCredentialsDto: UpdateUserDTO,
  ): Promise<User> {
    return this.authService.update(authCredentialsDto, user);
  }
}
