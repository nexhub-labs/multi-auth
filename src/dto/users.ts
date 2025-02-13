import { User } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    password: string;

    @IsString()
    @IsOptional()
    name: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class SocialLoginDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    provider: string; // 'google' | 'facebook' | etc.
}

export class VerificationDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsEmail()
    @IsOptional()
    email?: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;