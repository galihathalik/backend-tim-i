import { IsOptional } from "class-validator";

export class CreateAdminDto{
    @IsOptional()
    NamaLengkap: string;

    @IsOptional()
    Foto: string;
}