import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'admin',
  password: 'password',
  database: 'auth',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  migrations: [__dirname + '/../**/*.migration.{js,ts}'],
};
