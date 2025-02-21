import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SocialAuth, User } from '@prisma/client';
import { RegisterDto, UserWithoutPassword } from '../dto/users';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async welcome() {
    return "Welcome to Multi-Auth.";
  }

  async getUsers(): Promise<UserWithoutPassword[]> {
    return this.prisma.user.findMany({
      omit: { password: true }, // Exclude password field from the result
    });
  }

  async getUser(email: string): Promise<UserWithoutPassword | null> {
    return await this.findByEmailWithoutPassword(email);
  }

  async createUser({ name, email, password }: RegisterDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new HttpException('You already have an account. Please login!', HttpStatus.BAD_REQUEST);
    }

    // Hash password before storing
    const saltRounds = 12 + (Math.random() * 2) >> 0;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with hashed password
    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Link to local authentication provider
    await this.linkSocialAccount(user.id, 'local', user.id);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByEmailWithoutPassword(email: string): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({
      where: { email },
      omit: {
        password: true, // Exclude password from the result
      }
    });
  }

  async linkSocialAccount(userId: string, provider: string, providerId: string): Promise<SocialAuth> {
    return this.prisma.socialAuth.create({
      data: { userId, provider, providerId },
    });
  }
}
