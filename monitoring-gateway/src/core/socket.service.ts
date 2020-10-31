import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { observable, Observable } from "rxjs";
import * as socket from 'socket.io';
import { Events } from "./events";
import * as http from 'http';

@Injectable()
export class SocketService  {
    private io: socket.Server;
    constructor() {
        // Socket Server
       const server = http.createServer();
       server.listen(parseInt(process.env.SOCKET_PORT),`${process.env.SOCKET_HOST}`);
        this.io = socket.listen(server);
        console.log('listing')
    }
   
    emit(event: string, data: any) {
        this.io.emit(event, data);
    }

    startListen(deamonId: string){
        // start listen to Daemon events
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

         
      })

  
     
    }
}