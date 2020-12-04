import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesModule } from './machines/machines.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
     ignoreEnvFile: process.env.NODE_ENV == 'production'
     }),
    TypeOrmModule.forRoot({
      type: 'mssql',
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
    MachinesModule,
    AuthenticationModule
    
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}
