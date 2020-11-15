import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Events } from '../../core/events';
import { SocketService } from '../../core/socket.service';
import { ServiceFactory } from './service-factory.service';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(private serviceFactory: ServiceFactory, private socketService: SocketService) {

  }
   onModuleInit() {

    this.registerToDockerCommandEvents();

    setInterval( () => {
     this.serviceFactory.dockerInfo()
     .then(info=> {
      this.socketService.emitEvent(`${Events.DOCKER_ENGINE_INFO}`, info);
     })

   

    }, 5 * 1000)
    setInterval( () => {
       this.serviceFactory.healthcheck()
       .then(healthcheck=> {
        this.socketService.emitEvent(`${Events.HEALTH_CHECK}`, healthcheck);
       })

     
    }
      , 5 * 1000);

    setInterval( () => {
      this.serviceFactory.memoryUsage()
      .then(memory=> {
        this.socketService.emitEvent(`${Events.MEMORY_USAGE}`, memory);
      })
     
    }
      , 5 * 1000);

      setInterval( () => {
        this.serviceFactory.cpuUsage()
        .then(cpu=> {
          this.socketService.emitEvent(`${Events.CPU_USAGE}`, cpu);
        })
       
      }
        , 5 * 1000);


    setInterval( () => {

       this.serviceFactory.thermal()
       .then(thermal=> {
        this.socketService.emitEvent(`${Events.TEMPERATURE}`, thermal);
       })
     

    }
      , 5 * 1000);

    setInterval( () => {
     this.serviceFactory.diskUsage()
     .then(disk=> {
      this.socketService.emitEvent(`${Events.DISK_USAGE}`, disk);
     })
     
    }
      , 5 * 1000);

    setInterval( () => {
      this.serviceFactory.containersUsage()
      .then(disk=> {
        this.socketService.emitEvent(`${Events.CONTAINERS_METRICS}`, disk);
      })
     
    }
      , 5 * 1000);

    setInterval( () => {
      this.serviceFactory.containersList()
      .then(disk=> {
        this.socketService.emitEvent(`${Events.CONTAINERS_LIST}`, disk);
      })
      
    }
      , 5 * 1000);
      
  }


  private registerToDockerCommandEvents(): void {
    this.socketService.getSocket().on(`${process.env.MACHINE_ID}-${Events.CONTAINER_START}`,  (data) => {
       this.serviceFactory.startContainer(data);
    });

    this.socketService.getSocket().on(`${process.env.MACHINE_ID}-${Events.CONTAINER_STOP}`,  (data) => {
       this.serviceFactory.stopContainer(data);
    });

    this.socketService.getSocket().on(`${process.env.MACHINE_ID}-${Events.CONTAINER_RESTART}`,  (data) => {
       this.serviceFactory.restartContainer(data);
    });
    this.socketService.getSocket().on(`${process.env.MACHINE_ID}-${Events.CONTAINER_DELETE}`,  (data) => {
       this.serviceFactory.deleteContainer(data);
    });

    this.socketService.getSocket().on(`${process.env.MACHINE_ID}-${Events.DOCKER_RUN_IMAGE}`,  (data) => {
      this.serviceFactory.runImage(data);
    });

    this.socketService.getSocket().on(`${process.env.MACHINE_ID}-${Events.ASK_CONTAINER_LOGS}`,  (data) => {
      this.serviceFactory.containerLogs(data)
      .then(logs=> {
        this.socketService.emitEvent(`${Events.CONTAINER_LOGS}`, {
          containerId: data,
          logs: logs
        });
      });
   });

  }

}




