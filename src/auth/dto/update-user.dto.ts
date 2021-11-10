import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends CreateUserDTO {
  firebaseToken: string;
  oneSignalToken: string;
}
