import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './users/user.service';
import { PrismaService } from './shared/prisma.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './users/user.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService, UserService, PrismaService, JwtStrategy, ConfigService],
})
export class AppModule { }
