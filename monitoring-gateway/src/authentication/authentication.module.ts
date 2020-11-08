import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { UserManagementController } from './controllers/user-management.controller';
import { User } from './models/user.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy';
const jwtSecretKey = (process.env.JWT_SECRET || "secret@2010!");

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: 'jwt'
          }),
          JwtModule.register({
            secret: jwtSecretKey,
            signOptions: {
              expiresIn: 86400,
            }
          }),

       ],
    providers: [JwtStrategy,AuthService],
    controllers:[AuthController,UserManagementController]
})
export class AuthenticationModule {}
