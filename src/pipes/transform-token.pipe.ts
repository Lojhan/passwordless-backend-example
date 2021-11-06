import { PipeTransform, Injectable } from '@nestjs/common';
import { AuthCredentialsDTO as Before } from 'src/auth/dto/auth-credentials-before-treating.dto';
import { AuthCredentialsDTO as After } from 'src/auth/dto/auth-credentials.dto';

@Injectable()
export class TransformTokenPipe implements PipeTransform {
  transform(value: Before) {
    const credentials = new After();
    if (Array.isArray(value.password)) {
      credentials.password = value.password.reduce(
        (a, b) => a.toString() + b.toString(),
      );
    } else credentials.password = value.password;

    credentials.username = value.username;
    credentials.remember = value.remember;
    return credentials;
  }
}
