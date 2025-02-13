import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../shared/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, JwtService, PrismaService],
  controllers: [UserController]
})
export class UserModule {}
