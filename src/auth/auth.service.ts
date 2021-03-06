import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { GenerateTokenDTO } from './dto/generate-token-dto';
import * as moment from 'moment';
import { SignInResponse } from './dto/sign-in-response.dto';
import { User } from 'src/database/entities/user.entity';
import { MessageQueueClientService } from 'src/message-queue-client/message-queue-client.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private messageQueueClientService: MessageQueueClientService,
  ) {}

  async signUp(createUserDTO: CreateUserDTO): Promise<User> {
    return this.userRepository.signUp(createUserDTO);
  }

  update(authCredentialsDto: UpdateUserDTO, user: User): Promise<User> {
    return this.userRepository.save({ ...user, ...authCredentialsDto });
  }

  async signIn({
    username,
    remember,
    password,
    pushToken,
  }: AuthCredentialsDTO): Promise<SignInResponse> {
    const user = await this.userRepository.findByUsername(username);
    console.log(user);
    user.firebaseToken = pushToken;
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    if (!user.validatePassword(password))
      throw new UnauthorizedException('Token inválido');
    if (user.tokenUsed) throw new UnauthorizedException('Token já utilizado');

    user.tokenUsed = true;
    await user.save();

    delete user.tokenUsed;
    delete user.tokenValidation;
    delete user.password;

    return {
      user,
      token: this.jwtService.sign(
        { ...user },
        { expiresIn: remember ? '365d' : 3600 },
      ),
    };
  }

  async generateToken({ email, method }: GenerateTokenDTO): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    this.verifyMethod(method, user);
    user.password = this.generateNumbers();
    user.tokenUsed = false;
    user.tokenValidation = moment().add(5, 'minutes').toDate();
    await this.messageQueueClientService.sendNotification(
      `${method}-auth`,
      JSON.stringify(user),
    );
    await user.save();

    return user.username;
  }

  async verifyJwt(token: string): Promise<string> {
    try {
      const valid = await this.jwtService.verify(token);
      if (valid) return this.jwtService.sign({ username: valid.username });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  generateNumbers() {
    return Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9).toString(),
    ).reduce((a, b) => a + b);
  }

  verifyMethod(method: string, user: User) {
    if (method === 'mail') return;
    if (method === 'push') {
      if (!user.firebaseToken && !user.oneSignalToken)
        throw new BadRequestException(
          'O usuário não possui token de notificação push!',
        );
    }
  }
}
