import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class updateUserDto{
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    num_phone: string;
}