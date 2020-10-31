import { Injectable, OnModuleInit} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { throws } from 'assert';
import { Events } from '../../core/events';
import { SocketService } from '../../core/socket.service';
import { ServiceFactory } from './service-factory.service';

@Injectable()
export class TasksService  implements OnModuleInit {
       constructor(private serviceFactory: ServiceFactory, private socketService: SocketService) {
    
       }
       async onModuleInit() {
               setInterval(async ()=> {
                const info = await this.serviceFactory.dockerInfo();
          
                this.socketService.emitEvent(`${Events.DOCKER_ENGINE_INFO}`,info);

               },5 * 1000)
             setInterval(async ()=> 
               {
                   const healthcheck =  await this.serviceFactory.healthcheck();
                      
                  this.socketService.emitEvent(`${Events.HEALTH_CHECK}`,healthcheck);
               }
             ,5 * 1000);

             setInterval(async ()=> 
               {
                   const memory =   await this.serviceFactory.memoryUsage();
                   this.socketService.emitEvent(`${Events.MEMORY_USAGE}`,memory);
               }
             ,5 * 1000);

             setInterval(async ()=> 
             {
                   
                 const thermal =   await this.serviceFactory.thermal();
                 this.socketService.emitEvent(`${Events.TEMPERATURE}`,thermal);

             }
           ,5 * 1000);

           setInterval(async ()=> 
           {
            const disk = await this.serviceFactory.diskUsage();
            this.socketService.emitEvent(`${Events.DISK_USAGE}`,disk);
           }
         ,5 * 1000);

         setInterval(async ()=> 
           {
            const disk = await this.serviceFactory.containersUsage();
            this.socketService.emitEvent(`${Events.CONTAINERS_METRICS}`,disk);
           }
         ,5 * 1000);

         setInterval(async ()=> 
           {
            const disk = await this.serviceFactory.containersList();
            this.socketService.emitEvent(`${Events.CONTAINERS_LIST}`,disk);
           }
         ,5 * 1000);
       }

}




