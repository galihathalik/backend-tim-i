import { IsOptional } from "class-validator";

export class CreatePenumpangDto{
    @IsOptional()
    user_id: number;

    @IsOptional()
    NamaLengkap: string;

    @IsOptional()
    Foto: string;

    @IsOptional()
    Posisi: string;

}