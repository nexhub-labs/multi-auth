// AuthController.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, HttpException, Res, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/users';
import { convertDurationToNumbers } from 'duratii';
import { APIGuard } from './../../guards/api.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get()
  async getHello() {
    return "Hello World";
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(APIGuard) // This guard should validate credentials.
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      // Capture client metadata for session tracking.
      const ipAddress = req.ip;
      const userAgent = req.get('user-agent');

      // Pass login data along with client metadata to create a session.
      // AuthService.login should be updated to accept these additional parameters,
      // create a session record, and return an object containing the access_token and expiresIn.
      const token = await this.authService.login(body, { ipAddress, userAgent });

      // Set an HTTP‑only cookie with the session token.
      res.cookie('Authorization', `Bearer ${token.access_token}`, {
        path: '/',                                 // Available for all routes.
        httpOnly: isProduction,                    // Not accessible via JavaScript.
        secure: isProduction,                      // Only over HTTPS.
        sameSite: isProduction ? 'none' : 'lax',     // Adjust based on your cross‑site requirements.
        maxAge: convertDurationToNumbers(token.expiresIn).totalMilliseconds, // Convert token expiry to milliseconds.
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        expiresIn: token.expiresIn,
      };
    } catch (error) {
      // console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

const isProduction = process.env.NODE_ENV === 'production';
