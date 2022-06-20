import { IsOptional } from 'class-validator';

export class FIlterUSerDto {
  @IsOptional()
  role: string;
}
