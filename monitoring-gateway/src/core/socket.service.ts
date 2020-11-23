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
  private daemons: string[] = [];

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
        
        this.socketListen(deamonId,socket);
       
      })

  
     
    }

    private socketListen(deamonId: string ,socket: SocketIO.Socket){
      this.daemons.push(deamonId);
      socket.on(`${deamonId}-${Events.HEALTH_CHECK}`, (data: any) => {   
        this.io.emit(`ui-${deamonId}-${Events.HEALTH_CHECK}`,data);
       });

       socket.on(`${deamonId}-${Events.SUMMARY}`, (data: any) => {   
         this.logger.debug('summary ', JSON.stringify(data))
        this.io.emit(`ui-${deamonId}-${Events.SUMMARY}`,data);
       });

       
       socket.on(`${deamonId}-${Events.TEMPERATURE}`, (data: any) => {   
        this.io.emit(`ui-${deamonId}-${Events.TEMPERATURE}`,data);
       });

       socket.on(`${deamonId}-${Events.MEMORY_USAGE}`, (data: any) => {   
        this.io.emit(`ui-${deamonId}-${Events.MEMORY_USAGE}`,data);
       });

       socket.on(`${deamonId}-${Events.CPU_USAGE}`, (data: any) => {   
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
       this.logger.debug(`asking logs about ${data}`)
       this.io.emit(`${deamonId}-${Events.ASK_CONTAINER_LOGS}`,data);
      });

      socket.on(`${deamonId}-${Events.CONTAINER_LOGS}`, (data: any) => { 
        this.io.emit(`ui-${deamonId}-${Events.CONTAINER_LOGS}`,data);
       });
    }
  
     public  removeListeners(deamonId: string){
        try {
          delete this.daemons[deamonId];
          this.io.sockets.removeAllListeners();
          this.daemons.forEach(d=> {
            this.startListen(d);
          });
        } catch (error) {
          this.logger.debug(error);
        }
     }
}