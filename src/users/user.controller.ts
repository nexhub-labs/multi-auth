import { Controller, Post, Get, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../dto/users';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('')
  async welcome() {
    return this.userService.welcome();
  }

  @Post('all')
  @UseGuards(AuthGuard('jwt'))
  async users() {
    return this.userService.getUsers();
  }

  @Post('profile/me')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Body() { email }: { email: string; }) {
    if (!email) {
      throw new HttpException('Email is required...', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.getUser(email);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.userService.createUser(registerDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Your account is ready...',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
