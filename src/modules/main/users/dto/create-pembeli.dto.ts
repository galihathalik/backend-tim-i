import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePembeliDto {
  @IsOptional()
  NamaLengkap: string;

  @IsOptional()
  Paket: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  @IsString()
  Foto_Profil: string;

  @IsOptional()
  Path_Foto_Profil: string;
}
