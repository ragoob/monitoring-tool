import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { DockerModule } from './engine/docker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV == 'production'
    }),
    
    DockerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
