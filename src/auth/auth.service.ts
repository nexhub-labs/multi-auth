// auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/users';
import { User } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { convertDurationToNumbers } from 'duratii';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  private async getUserByEmail(email: string): Promise<User> {
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

  /**
   * Login a user, create a session, and return a JWT token.
   * @param user - login credentials.
   * @param clientMetadata - metadata such as ipAddress and userAgent.
   */
  async login(
    user: LoginDto,
    clientMetadata: { ipAddress?: string; userAgent?: string; }
  ): Promise<{ access_token: string; expiresIn: string; }> {
    const validatedUser = await this.validateUser(user.email, user.password);
    if (!validatedUser) {
      throw new HttpException(
        'Email or password is incorrect, please check and try again...',
        HttpStatus.UNAUTHORIZED
      );
    }
    const payload = { email: validatedUser.email, sub: validatedUser.id };
    const access_token = this.jwtService.sign(payload);
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    // Convert expiresIn string to milliseconds using duratii.
    const expiresInMs = convertDurationToNumbers(expiresIn).totalMilliseconds;
    const expiresAt = new Date(Date.now() + expiresInMs);

    // Create a session record in the database for tracking.
    await this.prisma.session.create({
      data: {
        userId: validatedUser.id,
        token: access_token,
        ipAddress: clientMetadata.ipAddress,
        userAgent: clientMetadata.userAgent,
        expiresAt: expiresAt,
      },
    });

    return {
      access_token,
      expiresIn,
    };
  }

  /**
   * Validate a token by verifying the JWT and ensuring the session exists and is active.
   * Optionally, update the lastAccess timestamp.
   * @param token - the JWT token.
   */
  async validateToken(token: string): Promise<any> {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    // Check if the session exists in the database.
    const session = await this.prisma.session.findUnique({
      where: { token },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.UNAUTHORIZED);
    }

    // Verify that the session has not expired.
    if (new Date() > session.expiresAt) {
      // Optionally, delete the expired session.
      await this.prisma.session.delete({ where: { token } });
      throw new HttpException('Session expired', HttpStatus.UNAUTHORIZED);
    }

    // Update the lastAccess timestamp to track activity.
    await this.prisma.session.update({
      where: { token },
      data: { lastAccess: new Date() },
    });

    const user = await this.getUserByEmail(decoded.email);
    return this.getUserWithoutPassword(user);
  }

  /**
   * Logout a user by deleting the session associated with the provided token.
   * @param token - the JWT token to invalidate.
   */
  async logout(token: string): Promise<{ message: string; }> {
    await this.prisma.session.deleteMany({ where: { token } });
    return { message: 'Logged out successfully' };
  }
}
