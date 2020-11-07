import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketService } from './core/socket.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesModule } from './machines/machines.module';
import { MachineService } from './machines/services/machine.service';

@Module({
  imports: [
    ConfigModule.forRoot({
    ignoreEnvFile: process.env.NODE_ENV == 'production'
     }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        "dist/**/*.entity.{ts,js}",
      ],
      logging: true,
      synchronize: true,
    }),
  

    MachinesModule
    
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}
