import { Module } from '@nestjs/common';
import { UtilService } from '../core/util.service';
import { ContainerService } from './services/container.service';
import { EngineService } from './services/engine.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/tasks.service';
import { SocketService } from '../core/socket.service';
import { ServiceFactory } from './services/service-factory.service';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [UtilService,ContainerService,EngineService,SocketService,ServiceFactory,TasksService],
    controllers: [],
    
})
export class EngineModule {}
