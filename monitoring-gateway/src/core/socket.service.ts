import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { observable, Observable } from "rxjs";
import * as socket from 'socket.io';
import { SocketChanels } from "./socket-chanels";
@Injectable()
export class SocketService  {
    private io: socket.Server;
    constructor() {
        // Socket Server
        this.io = socket(4001);
    }
   
    emit(event: string, data: any) {
        this.io.emit(event, data);
    }

    startListen(deamonId: string){
      // start listen to Daemon events
      this.io.on('connection',(socket)=> {
       
        socket.on(`${deamonId}-${SocketChanels.HEALTH_CHECK}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.HEALTH_CHECK}`,data)       
          this.io.emit(`ui-${deamonId}-${SocketChanels.HEALTH_CHECK}`,data);
         });

         socket.on(`${deamonId}-${SocketChanels.TEMPERATURE}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.TEMPERATURE}` , data)       
          this.io.emit(`ui-${deamonId}-${SocketChanels.TEMPERATURE}`,data);
         });

         socket.on(`${deamonId}-${SocketChanels.MEMORY_USAGE}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.MEMORY_USAGE}` , data)       
          this.io.emit(`ui-${deamonId}-${SocketChanels.MEMORY_USAGE}`,data);
         });

         socket.on(`${deamonId}-${SocketChanels.DISK_USAGE}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.DISK_USAGE}` , data)       
          this.io.emit(`ui-${deamonId}-${SocketChanels.DISK_USAGE}`,data);
         });
       
         socket.on(`${deamonId}-${SocketChanels.CONTAINERS_METRICS}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.CONTAINERS_METRICS}` , data)       
          this.io.emit(`ui-${deamonId}-${SocketChanels.CONTAINERS_METRICS}`,data);
         });

         socket.on(`${deamonId}-${SocketChanels.CONTAINERS_LIST}`, (data: any) => {   
          console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.CONTAINERS_LIST}` , data)       
          this.io.emit(`ui-${deamonId}-${SocketChanels.CONTAINERS_LIST}`,data);
         });

         socket.on(`${deamonId}-disconnected`, (data: any) => {   
          this.io.emit(`ui-${deamonId}-disconnected`,data);
         });

         socket.on(`${deamonId}-${SocketChanels.DOCKER_ENGINE_INFO}`, (data: any) => {   
           console.log(`${new Date().toLocaleTimeString('it-IT')} ${SocketChanels.DOCKER_ENGINE_INFO}`,data)
           this.io.emit(`ui-${deamonId}-${SocketChanels.DOCKER_ENGINE_INFO}`,data);
         });

         
      })

  
     
    }
}