import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class createPasangDto {
  @ApiProperty()
  @IsOptional()
  tujuan: string;

  @ApiProperty()
  @IsOptional()
  tipe: string;

  @ApiProperty()
  @IsOptional()
  lokasi: string;

  @ApiProperty()
  @IsOptional()
  luasBangunan: string;

  @ApiProperty()
  @IsOptional()
  hargaTotal: number;

  @ApiProperty()
  @IsOptional()
  jumlahKamarTidur: number;

  @ApiProperty()
  @IsOptional()
  jumlahKamarMandi: number;

  @ApiProperty()
  @IsOptional()
  judul: string;

  @ApiProperty()
  @IsOptional()
  deskripsi: string;

  @ApiProperty()
  @IsOptional()
  alamatEmail: string;

  @ApiProperty()
  @IsOptional()
  nomorHP: number;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  Foto: string;
}
