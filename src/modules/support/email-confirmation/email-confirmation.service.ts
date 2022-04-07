import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/main/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @Inject(forwardRef(() => JwtService))
    @Inject(forwardRef(() => ConfigService))
    @Inject(forwardRef(() => EmailService))
    @Inject(forwardRef(() => UsersService))
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) { }

  public sendVerificationLink(email: string) {
    const payload = {
      email: email
    }
    const token = this.jwtService.sign(payload);
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
    const text = `Welcome to the Parkuy. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    })
  }

  async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (user.emailVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.EmailHasBeenConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}