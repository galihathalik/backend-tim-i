import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './modules/main/users/users.module';
import { AuthModule } from './modules/main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailConfirmationModule } from './modules/support/email-confirmation/email-confirmation.module';
import { EmailConfirmationController } from './modules/support/email-confirmation/email-confirmation.controller';
import * as Joi from 'joi';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    UsersModule, 
    AuthModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USERNAME: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      })
    }),
  ],
  controllers: [],
})
export class AppModule {}
 