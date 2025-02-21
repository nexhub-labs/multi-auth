// AuthController.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, HttpException, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/users';
import { convertDurationToNumbers } from 'duratii';
import { APIGuard } from './../../guards/api.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get()
  async getHello() {
    return "Hello World";
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(APIGuard) // Your guard should verify credentials
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      const token = await this.authService.login(body);
      // console.log(token);
      // console.log("convertDurationToNumbers(token.expiresIn).totalMilliseconds", convertDurationToNumbers(token.expiresIn).totalMilliseconds);
      // Set an HTTP‑only cookie with the token.
      res.cookie('Authorization', `Bearer ${token.access_token}`, {
        path: '/',             // Available for all routes
        httpOnly: isProduction,        // Not accessible by JavaScript
        secure: isProduction,          // Only over HTTPS (adjust for local development)
        sameSite: isProduction ? 'none' : 'lax', // Allow cross‑site cookie if needed
        maxAge: convertDurationToNumbers(token.expiresIn).totalMilliseconds, // expiry in milliseconds (e.g. expiresIn in duration (e.g. "1y 2mo 3w 4d 5h 6m 7s 250ms"))
      });

      // Optionally, you can return the user info and/or token expiry details.
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        expiresIn: token.expiresIn,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

const isProduction = process.env.NODE_ENV === 'production';