import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    num_phone: string;
}