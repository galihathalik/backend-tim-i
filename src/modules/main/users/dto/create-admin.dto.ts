import { IsOptional } from "class-validator";

export class CreateAdminDto{
    @IsOptional()
    user_id: number;

    @IsOptional()
    NamaLengkap: string;

    @IsOptional()
    Foto: string;

}