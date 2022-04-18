import { IsOptional } from "class-validator";

export class CreatePenumpangDto{
    @IsOptional()
    NamaLengkap: string;

    @IsOptional()
    Foto: string;

}