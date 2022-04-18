import { IsOptional } from "class-validator";

export class CreateSopirDto{
    @IsOptional()
    NamaLengkap: string;

    @IsOptional()
    Foto: string;

}