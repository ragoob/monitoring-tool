import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV == 'production'
    }),
    
    EngineModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
