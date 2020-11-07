import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Events } from "./events";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class SocketService implements OnGatewayConnection  {
  private logger: Logger = new Logger(SocketService.name);
  @WebSocketServer() io: Server;

  handleConnection(client: any, ...args: any[]) {
  // this.logger.debug(`client connected: ${JSON.stringify(client.id)}`);
  }
   
    emit(event: string, data: any) {
        this.io.emit(event, data);
    }

    startListen(deamonId: string){
      this.logger.debug(`Start listen to daemon ${deamonId}`);

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

      })

  
     
    }
}