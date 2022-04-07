import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/modules/main/users/users.module';
import { EmailModule } from '../email/email.module';
import { EmailConfirmationService } from './email-Confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';

@Module({
    imports:[
        forwardRef(() => ConfigModule),
        forwardRef(() => EmailModule),
        forwardRef(() => UsersModule),
        forwardRef(() => JwtModule),
    ],
    providers: [EmailConfirmationService],
    exports: [EmailConfirmationService],
    controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
