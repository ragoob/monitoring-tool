import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
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
      
        this.io = socket.listen(server,{
          path: '/socket',
          transports: ['websocket']
        });

     server.listen(parseInt(process.env.SOCKET_PORT));

     

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

         socket.on(`ui-${deamonId}-${Events.CONTAINER_START}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_START}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_RESTART}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_RESTART}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_STOP}`, (data: any) => {   
           console.log('stopping container ' + data)
          this.io.emit(`${deamonId}-${Events.CONTAINER_STOP}`,data);
         });

         socket.on(`ui-${deamonId}-${Events.CONTAINER_DELETE}`, (data: any) => {   
          this.io.emit(`${deamonId}-${Events.CONTAINER_DELETE}`,data);
         });

        

         
      })

  
     
    }
}