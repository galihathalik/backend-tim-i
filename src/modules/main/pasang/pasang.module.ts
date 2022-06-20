import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PembeliRepository } from '../users/repository/pembeli.repository';
import { PasangController } from './pasang.controller';
import { PasangService } from './pasang.service';
import { PasangRepository } from './repository/pasang.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PembeliRepository, PasangRepository]),
    PasangModule,
  ],
  controllers: [PasangController],
  providers: [PasangService],
  exports: [PasangService],
})
export class PasangModule {}
