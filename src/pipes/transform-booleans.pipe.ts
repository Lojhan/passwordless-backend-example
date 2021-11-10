import { PipeTransform, Injectable } from '@nestjs/common';
import { AuthCredentialsDTO as Before } from 'src/auth/dto/auth-credentials-before-treating.dto';
import { AuthCredentialsDTO as After } from 'src/auth/dto/auth-credentials.dto';

@Injectable()
export class TransformBooleansPipe implements PipeTransform {
  transform(value: Before) {
    const credentials = new After();
    if (typeof value.remember === 'string') {
      credentials.remember = value.remember === 'true';
    }
    credentials.password = value.password as unknown as string;
    credentials.username = value.username;
    credentials.pushToken = value.pushToken;
    return credentials;
  }
}
