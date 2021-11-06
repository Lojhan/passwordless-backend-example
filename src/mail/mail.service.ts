import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTokenMail(user: User) {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Sign In Token',
      template: `${__dirname}/templates/token.template.hbs`,
      context: { user },
    });
  }
}
