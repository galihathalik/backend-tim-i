import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/main/users/users.module';
import { AuthModule } from './modules/main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import AppConfig, { DbConfigMysql, DbConfigRedis } from 'src/config/app.config';
import * as Joi from 'joi';
import { User } from './entities/users.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Penumpang } from './entities/penumpang.entity';
import { Sopir } from './entities/sopir.entity';
import { Admin } from './entities/admin.entity';

const dbConfigMysql: DbConfigMysql = AppConfig().db.mysql;
const dbConfigRedis: DbConfigRedis = AppConfig().db.redis;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbConfigMysql.host,
      port: dbConfigMysql.port,
      username: dbConfigMysql.user,
      password: dbConfigMysql.password,
      database: dbConfigMysql.database,
      entities: [
        User,
        Penumpang,
        Sopir,
        Admin,
        RefreshToken
      ],
      synchronize: true
    }), 
    UsersModule, 
    AuthModule,
    ConfigModule.forRoot({
      load: [AppConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 