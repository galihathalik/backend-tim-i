import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class updateUserDto{
    @IsOptional()
    username: string;

    @IsOptional()
    password: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    num_phone: string;

}