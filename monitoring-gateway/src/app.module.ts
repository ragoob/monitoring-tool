import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './core/socket.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV == 'production'
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService,SocketService],
})
export class AppModule {}
