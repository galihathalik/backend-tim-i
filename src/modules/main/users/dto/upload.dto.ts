import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class uploadDto {
  @ApiProperty()
  NamaLengkap: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  Foto_Profil: string;

  @IsOptional()
  Path_Foto_Profil: string;
}
