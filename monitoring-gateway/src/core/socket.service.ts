import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Events } from "./events";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
 serveClient: false,
 pingTimeout: 300000,
 pingInterval: 5000 
})
export class SocketService implements OnGatewayConnection , OnModuleInit  {
  onModuleInit() {
  
  }
  
  private logger: Logger = new Logger(SocketService.name);
  @WebSocketServer() io: Server;
  
  handleConnection(client: any, ...args: any[]) {
  }
   
    emit(event: string, data: any) {
        this.io.emit(event, data);
    }

    startListen(deamonId: string){
      
     
      try {
        this.removeListeners(deamonId);
      } catch (error) {
         console.log(`error in removing listeners ${error}`)
      }

       this.io.on('connection',(socket)=> {
        
        socket.on(`${deamonId}-${Events.HEALTH_CHECK}`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-${Events.HEALTH_CHECK}`,data);
         });
         
         socket.on(`${deamonId}-${Events.TEMPERATURE}`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-${Events.TEMPERATURE}`,data);
         });

         socket.on(`${deamonId}-${Events.MEMORY_USAGE}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${Events.MEMORY_USAGE}` , data)       
          this.io.emit(`ui-${deamonId}-${Events.MEMORY_USAGE}`,data);
         });

         socket.on(`${deamonId}-${Events.CPU_USAGE}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${Events.CPU_USAGE}` , data)       
          this.io.emit(`ui-${deamonId}-${Events.CPU_USAGE}`,data);
         });

         socket.on(`${deamonId}-${Events.DISK_USAGE}`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-${Events.DISK_USAGE}`,data);
         });
       
         socket.on(`${deamonId}-${Events.CONTAINERS_METRICS}`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-${Events.CONTAINERS_METRICS}`,data);
         });

         socket.on(`${deamonId}-${Events.CONTAINERS_LIST}`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-${Events.CONTAINERS_LIST}`,data);
         });


         socket.on(`${deamonId}-${Events.DOCKER_ENGINE_INFO}`, (data: any) => {   
           this.io.emit(`ui-${deamonId}-${Events.DOCKER_ENGINE_INFO}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_START}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_START}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_RESTART}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_RESTART}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_STOP}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_STOP}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_DELETE}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_DELETE}`,data);
         });
         
         socket.on(`ui-${deamonId}-${Events.DOCKER_RUN_IMAGE}`, (data: any) => {  
           this.logger.debug("DOCKER_RUN_IMAGE" ,data)
          this.io.emit(`${deamonId}-${Events.DOCKER_RUN_IMAGE}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.ASK_CONTAINER_LOGS}`, (data: any) => {  
        
         this.io.emit(`${deamonId}-${Events.ASK_CONTAINER_LOGS}`,data);
        });

        socket.on(`${deamonId}-${Events.CONTAINER_LOGS}`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-${Events.CONTAINER_LOGS}`,data);
         });

         //

      })

  
     
    }

     private  removeListeners(deamonId: string){
      this.io.sockets.removeAllListeners(`${deamonId}-${Events.HEALTH_CHECK}`);
      this.io.sockets.removeAllListeners(`${deamonId}-${Events.TEMPERATURE}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.MEMORY_USAGE}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.DISK_USAGE}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.DOCKER_ENGINE_INFO}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.HEALTH_CHECK}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.CONTAINER_START}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.CONTAINER_RESTART}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.CONTAINER_STOP}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.CONTAINER_DELETE}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.CONTAINER_DETAILS}`);
       this.io.sockets.removeAllListeners(`${deamonId}-${Events.DOCKER_RUN_IMAGE}`);

    }
}