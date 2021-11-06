import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';

@Controller('posts')
@UseGuards(AuthGuard(), RolesGuard)
export class PostsController {
  @Get()
  @Roles('adm', 'user')
  create(@GetUser() user: User) {
    return user;
  }
}
