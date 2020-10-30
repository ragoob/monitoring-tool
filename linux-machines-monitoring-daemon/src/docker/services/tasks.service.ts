import { Injectable, OnModuleInit} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { throws } from 'assert';
import { SocketChanels } from '../../core/socket-chanels';
import { SocketService } from '../../core/socket.service';
import { ServiceFactory } from './service-factory.service';

@Injectable()
export class TasksService  implements OnModuleInit {
       constructor(private serviceFactory: ServiceFactory, private socketService: SocketService) {
      
              

       }
       async onModuleInit() {
            
                 console.log('on module init')
            this.socketService.getSocket().on(`${process.env.MACHINE_ID}-intial-info`,async ()=> {
              console.log('get Initial info')
                 const health = await this.serviceFactory.healthcheck();

                 this.socketService.emitEvent(`${SocketChanels.HEALTH_CHECK}`,health);

                  const info = await this.serviceFactory.dockerInfo();
          
                  this.socketService.emitEvent(`${SocketChanels.DOCKER_ENGINE_INFO}`,info);

                  const memory =   await this.serviceFactory.memoryUsage();
                   this.socketService.emitEvent(`${SocketChanels.MEMORY_USAGE}`,memory);

                   const thermal =   await this.serviceFactory.thermal();
                   this.socketService.emitEvent(`${SocketChanels.TEMPERATURE}`,thermal);

                   const disk = await this.serviceFactory.diskUsage();
                   this.socketService.emitEvent(`${SocketChanels.DISK_USAGE}`,disk);

                   const containers = await this.serviceFactory.containersUsage();
                   this.socketService.emitEvent(`${SocketChanels.DISK_USAGE}`,disk);
                  
               })

               setInterval(async ()=> {
                const info = await this.serviceFactory.dockerInfo();
          
                this.socketService.emitEvent(`${SocketChanels.DOCKER_ENGINE_INFO}`,info);

               },2000)
             setInterval(async ()=> 
               {
                   const healthcheck =  await this.serviceFactory.healthcheck();
                      
                  this.socketService.emitEvent(`${SocketChanels.HEALTH_CHECK}`,healthcheck);
               }
             ,1 * 1000);

             setInterval(async ()=> 
               {
                   const memory =   await this.serviceFactory.memoryUsage();
                   this.socketService.emitEvent(`${SocketChanels.MEMORY_USAGE}`,memory);
               }
             ,5 * 1000);

             setInterval(async ()=> 
             {
                   
                 const thermal =   await this.serviceFactory.thermal();
                 this.socketService.emitEvent(`${SocketChanels.TEMPERATURE}`,thermal);

             }
           ,5 * 1000);

           setInterval(async ()=> 
           {
            const disk = await this.serviceFactory.diskUsage();
            this.socketService.emitEvent(`${SocketChanels.DISK_USAGE}`,disk);
           }
         ,5 * 1000);

         setInterval(async ()=> 
           {
            const disk = await this.serviceFactory.containersUsage();
            this.socketService.emitEvent(`${SocketChanels.CONTAINERS_METRICS}`,disk);
           }
         ,5 * 1000);

         setInterval(async ()=> 
           {
            const disk = await this.serviceFactory.containersList();
            this.socketService.emitEvent(`${SocketChanels.CONTAINERS_LIST}`,disk);
           }
         ,5 * 1000);
       }

}




