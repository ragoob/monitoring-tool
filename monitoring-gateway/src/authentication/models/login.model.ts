import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginModel{
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}