import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class updateUserPembeliDto {
  //@ApiProperty()
  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  num_phone: string;

  @ApiProperty()
  @IsOptional()
  NamaLengkap: string;

  @ApiProperty()
  @IsOptional()
  Foto: string;

  // @Column({ default: false })
  //   JualVerified: boolean;
}
