import {Injectable, OnModuleInit} from "@nestjs/common";
import { Events } from "./events";
import * as socket from 'socket.io';

@Injectable()
export class SocketService implements OnModuleInit   {
  

  private io: socket.Server = socket(4020);

   onModuleInit() {
     this.startListen();
   }
    emit(event: string, data: any) {
        this.io.emit(event, data);
    }

    startListen(){
       this.io.on('connection',(client)=> {
          client.on(Events.HEALTH_CHECK, (data: any) => {
             this.io.emit('ui-' + Events.HEALTH_CHECK, data);
          });

          client.on(Events.SUMMARY, (data: any) => {
             this.io.emit('ui-' + Events.SUMMARY, data);
          });


          client.on(Events.TEMPERATURE, (data: any) => {
             this.io.emit('ui-' + Events.TEMPERATURE, data);
          });

          client.on(Events.MEMORY_USAGE, (data: any) => {
             this.io.emit('ui-' + Events.MEMORY_USAGE, data);
          });

          client.on(Events.CPU_USAGE, (data: any) => {
             this.io.emit('ui-' + Events.CPU_USAGE, data);
          });

          client.on(Events.DISK_USAGE, (data: any) => {
             this.io.emit('ui-' + Events.DISK_USAGE, data);
          });

          client.on(Events.CONTAINERS_METRICS, (data: any) => {
             this.io.emit('ui-' + Events.CONTAINERS_METRICS, data);
          });

          client.on(Events.CONTAINERS_LIST, (data: any) => {
             this.io.emit('ui-' + Events.CONTAINERS_LIST, data);
          });


          client.on(Events.DOCKER_ENGINE_INFO, (data: any) => {
             this.io.emit('ui-' + Events.DOCKER_ENGINE_INFO, data);
          });

          client.on('ui-' + Events.CONTAINER_START, (data: any) => {
             this.io.emit(Events.CONTAINER_START, data);
          });

          client.on('ui-' + Events.CONTAINER_RESTART, (data: any) => {
             this.io.emit(Events.CONTAINER_RESTART, data);
          });

          client.on('ui-' + Events.CONTAINER_STOP, (data: any) => {
             this.io.emit(Events.CONTAINER_STOP, data);
          });

          client.on('ui-' + Events.CONTAINER_DELETE, (data: any) => {
             this.io.emit(Events.CONTAINER_DELETE, data);
          });

          client.on('ui-' + Events.DOCKER_RUN_IMAGE, (data: any) => {
             this.io.emit(Events.DOCKER_RUN_IMAGE, data);
          });

          client.on('ui-' + Events.ASK_CONTAINER_LOGS, (data: any) => {
             this.io.emit(Events.ASK_CONTAINER_LOGS, data);
          });

          client.on(Events.CONTAINER_LOGS, (data: any) => {
             this.io.emit('ui-' + Events.CONTAINER_LOGS, data);
          });
      })
    }


}
