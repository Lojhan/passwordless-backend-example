import * as moment from 'moment';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ObjectIdColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'users' })
// @Unique(['username'])
// @Unique(['id'])
// @Unique(['email'])
export class User extends BaseEntity {
  constructor(
    username?: string,
    birthDate?: Date,
    email?: string,
    region?: string,
    phoneNumber?: string,
    profilePicturePath?: string,
  ) {
    super();
    this.username = username;
    this.birthDate = birthDate;
    this.email = email;
    this.region = region;
    this.phoneNumber = phoneNumber;
    this.profilePicturePath = profilePicturePath;
    // this.id = uuid();
  }

  // @PrimaryColumn()
  @ObjectIdColumn()
  id: string;

  @PrimaryColumn()
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'boolean' })
  tokenUsed = false;

  @Column({ nullable: true })
  tokenValidation: Date;

  @Column()
  role: 'user' | 'adm' = 'adm';

  @PrimaryColumn()
  email: string;

  @Column({ nullable: true })
  profilePicturePath: string;

  @Column()
  birthDate: Date;

  @PrimaryColumn()
  phoneNumber: string;

  @Column()
  region: string;

  @Column({ nullable: true })
  firebaseToken: string;

  @Column({ nullable: true })
  oneSignalToken: string;

  validatePassword(password: string): boolean {
    if (moment().isAfter(this.tokenValidation)) return false;
    return this.password === password;
  }
}
