import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from '../../auth/dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(createCredentialsDto: CreateUserDTO): Promise<User> {
    try {
      const user = this.create(createCredentialsDto);
      return user.save();
    } catch (err) {
      if (err.code == 23505)
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDTO,
  ): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user.validatePassword(password)) return user;
    else return null;
  }

  async findByUsername(username: string) {
    return this.findOne({ where: { username } });
  }
}
