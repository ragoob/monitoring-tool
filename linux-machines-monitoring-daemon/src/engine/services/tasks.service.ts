import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { Events } from '../../core/events';
import { SocketService } from '../../core/socket.service';
import { ServiceFactory } from './service-factory.service';
const interval: number =   5000
@Injectable()
export class TasksService implements OnModuleInit {
 
  public stopTasks$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  private intervals: NodeJS.Timeout[] = [];
  constructor(private serviceFactory: ServiceFactory, 
    private socketService: SocketService, 
    private httpService: HttpService ) {

  }
   onModuleInit() {
     this.socketService.socket.on('shutdown', (data) => {
       if (data.daemonId == process.env.MACHINE_ID) {
         this.socketService.socket.disconnect();
         this.stopTasks$.next(true);
       }
     });

    this.httpService.get(process.env.GATE_WAY_URL + '/machine/' + process.env.MACHINE_ID)
    .toPromise()
    .then(response=> {
      if(response.data && response.data.id){
        console.log('Socket is connected ? ' , this.socketService.socket.connected);
        this.stopTasks();
        this.registerToDockerCommandEvents();
        this.startIntervals();
        
        
      }

      else{
        this.socketService.socket.disconnect();
        this.socketService.socket.close();
        this.stopTasks();
      }
    });
    
  }
  private registerToDockerCommandEvents(): void {
    this.socketService.socket.on(Events.CONTAINER_START,  (data) => {
       if(data.deamonId == process.env.MACHINE_ID){
        this.serviceFactory.startContainer(data.containerId);
       }
      
    });

    this.socketService.socket.on(Events.CONTAINER_STOP,  (data) => {
      if(data.daemonId == process.env.MACHINE_ID){
        this.serviceFactory.stopContainer(data.containerId);
      }
       
    });

    this.socketService.socket.on(Events.CONTAINER_RESTART,  (data) => {
      if(data.daemonId == process.env.MACHINE_ID){
        this.serviceFactory.restartContainer(data.containerId);
      }
      
    });
    this.socketService.socket.on(Events.CONTAINER_DELETE,  (data) => {
      if(data.daemonId == process.env.MACHINE_ID){
        this.serviceFactory.deleteContainer(data.containerId);
      }
     
    });

    this.socketService.socket.on(Events.DOCKER_RUN_IMAGE,  (data) => {
      if(data.daemonId == process.env.MACHINE_ID){
      this.serviceFactory.runImage(data.containerId);
    }
    });

    this.socketService.socket.on(Events.ASK_CONTAINER_LOGS,  (data) => {
      if(data.daemonId == process.env.MACHINE_ID){
      this.serviceFactory.containerLogs(data.containerData.containerId,data.containerData.args)
      .then(value=> {
        this.socketService.emitEvent(`${Events.CONTAINER_LOGS}`, {
          machineId: process.env.MACHINE_ID,
          containerId: data.containerId,
          logs: value
        });
      });

    }
   });

  }

  private startIntervals(): void{
    this.intervals.push(
      setInterval( () => {
        this.serviceFactory.dockerInfo()
        .then(info=> {
         this.socketService.emitEvent(`${Events.DOCKER_ENGINE_INFO}`, info);
        })
       }, interval)
    )
   


    this.intervals.push(
    setInterval( () => {
       this.serviceFactory.healthcheck()
       .then(healthcheck=> {
        this.socketService.emitEvent(`${Events.HEALTH_CHECK}`, healthcheck);
       })
    }
      , interval)

    );

    this.intervals.push(
      setInterval( () => {
        this.serviceFactory.summary()
        .then(summary=> {
         this.socketService.emitEvent(`${Events.SUMMARY}`, summary);
        })
     }
       ,interval)
    );

    this.intervals.push(
    setInterval( () => {
      this.serviceFactory.memoryUsage()
      .then(memory=> {
        this.socketService.emitEvent(`${Events.MEMORY_USAGE}`, memory);
      })
    }
      , interval)
    );

    this.intervals.push(
      setInterval( () => {
        this.serviceFactory.cpuUsage()
        .then(cpu=> {
          this.socketService.emitEvent(`${Events.CPU_USAGE}`, cpu);
        })
      }
        , interval)
    );


    this.intervals.push(
    setInterval( () => {
       this.serviceFactory.thermal()
       .then(thermal=> {
        this.socketService.emitEvent(`${Events.TEMPERATURE}`, thermal);
       })
    }
      , interval)
    );

    this.intervals.push(
    setInterval( () => {
     this.serviceFactory.diskUsage()
     .then(disk=> {
      this.socketService.emitEvent(`${Events.DISK_USAGE}`, disk);
     })
    }
      , interval)
    );

    this.intervals.push(
    setInterval( () => {
      this.serviceFactory.containersUsage()
      .then(disk=> {
        this.socketService.emitEvent(`${Events.CONTAINERS_METRICS}`, disk);
      })
    }
      , interval)
    );

    this.intervals.push(

    setInterval( () => {
      this.serviceFactory.containersList()
      .then(disk=> {
        this.socketService.emitEvent(`${Events.CONTAINERS_LIST}`, disk);
      })
    }
      , interval));
  }
  private stopTasks(): void{
    this.intervals.forEach((interval: NodeJS.Timeout)=> {
      clearInterval(interval);
    });
  }
}




