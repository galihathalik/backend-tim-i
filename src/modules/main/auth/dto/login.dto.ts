import { IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
    @IsOptional()
    email: string;

    @IsOptional()
    username: string;

    @IsNotEmpty()
    password: string;
}