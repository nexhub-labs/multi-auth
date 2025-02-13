import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/users';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private async getUserByEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Email not registered. Please sign up...', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async getUserWithoutPassword(user: User) {
    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string): Promise<any | null> {
    const user = await this.getUserByEmail(email);
    const isPWMatch = await this.validatePassword(password, user.password);
    if (!isPWMatch) {
      return null;
    }
    return this.getUserWithoutPassword(user);
  }

  async login(user: LoginDto): Promise<{ access_token: string, expiresIn: string }> {
    const validatedUser = await this.validateUser(user.email, user.password);
    if (!validatedUser) {
      throw new HttpException('Email or password is incorrect, please check and try again...', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: validatedUser.email, sub: validatedUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.getUserByEmail(decoded.email);
      return this.getUserWithoutPassword(user);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}