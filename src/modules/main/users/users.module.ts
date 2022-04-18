import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config/jwt.config';
import { EmailModule } from 'src/modules/support/email/email.module';
import { AdminRepository } from './repository/admin.repository';
import { PenumpangRepository } from './repository/penumpang.repository';
import { SopirRepository } from './repository/sopir.repository';
import { UserRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, SopirRepository, AdminRepository, PenumpangRepository]),
    ConfigModule,
    EmailModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
