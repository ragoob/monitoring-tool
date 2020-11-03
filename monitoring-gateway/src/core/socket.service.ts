import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { observable, Observable } from "rxjs";
import * as socket from 'socket.io';
import { Events } from "./events";
import * as http from 'http';

@Injectable()
export class SocketService  {
    private io: socket.Server;
    private nsp: socket.Namespace;
    constructor() {
        // Socket Server
       const server = http.createServer();
        this.io = socket(server);
        this.nsp = this.io.of("/websockettest");

    }
   
    emit(event: string, data: any) {
        this.io.emit(event, data);
    }

    startListen(deamonId: string){
        // start listen to Daemon events
      this.nsp.on('connection',(socket)=> {
       
        socket.on(`${deamonId}-${Events.HEALTH_CHECK}`, (data: any) => {   
          this.nsp.emit(`ui-${deamonId}-${Events.HEALTH_CHECK}`,data);
         });
         
         socket.on(`${deamonId}-${Events.TEMPERATURE}`, (data: any) => {   
          this.nsp.emit(`ui-${deamonId}-${Events.TEMPERATURE}`,data);
         });

         socket.on(`${deamonId}-${Events.MEMORY_USAGE}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${Events.MEMORY_USAGE}` , data)       
          this.nsp.emit(`ui-${deamonId}-${Events.MEMORY_USAGE}`,data);
         });

         socket.on(`${deamonId}-${Events.DISK_USAGE}`, (data: any) => {   
          this.nsp.emit(`ui-${deamonId}-${Events.DISK_USAGE}`,data);
         });
       
         socket.on(`${deamonId}-${Events.CONTAINERS_METRICS}`, (data: any) => {   
          this.nsp.emit(`ui-${deamonId}-${Events.CONTAINERS_METRICS}`,data);
         });

         socket.on(`${deamonId}-${Events.CONTAINERS_LIST}`, (data: any) => {   
          this.nsp.emit(`ui-${deamonId}-${Events.CONTAINERS_LIST}`,data);
         });


         socket.on(`${deamonId}-${Events.DOCKER_ENGINE_INFO}`, (data: any) => {   
           this.nsp.emit(`ui-${deamonId}-${Events.DOCKER_ENGINE_INFO}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_START}`, (data: any) => {   
          this.nsp.emit(`${deamonId}-${Events.CONTAINER_START}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_RESTART}`, (data: any) => {   
          this.nsp.emit(`${deamonId}-${Events.CONTAINER_RESTART}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_STOP}`, (data: any) => {   
          
          this.nsp.emit(`${deamonId}-${Events.CONTAINER_STOP}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_DELETE}`, (data: any) => {   
          this.nsp.emit(`${deamonId}-${Events.CONTAINER_DELETE}`,data);
         });
      })

  
     
    }
}