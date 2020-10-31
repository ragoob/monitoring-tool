import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Events } from '../models/events';
import { RxSocket } from './rx-socket-io';
import * as socketIO from 'socket.io-client';

@Injectable()
export class SocketService{
  constructor(){
   
    }
   

    public emit(event,data){
      const socket = socketIO(environment.socketServer); 
      socket.emit(event,data);
    }
    public getDeamonAlive(daemonId: string): Observable<string>{
      const socket = new RxSocket(environment.socketServer); 
      const event$ = socket.observable<string>(`ui-${daemonId}-${Events.HEALTH_CHECK}`);
      return event$;
    }

    public getDeamontemperature(daemonId: string): Observable<any>{
      const socket = new RxSocket(environment.socketServer); 

      const event$ = socket.observable(`ui-${daemonId}-${Events.TEMPERATURE}`);
      return event$;
      }

      public getDeamonMemoryUsage(daemonId: string): Observable<any>{
        const socket = new RxSocket(environment.socketServer); 

        const event$ = socket.observable(`ui-${daemonId}-${Events.MEMORY_USAGE}`);
        return event$;

      }

      public getContainerUsage(daemonId: string): Observable<any>{
        const socket = new RxSocket(environment.socketServer); 

        const event$ = socket.observable(`ui-${daemonId}-${Events.CONTAINERS_METRICS}`);
        return event$;
      }

      public getContainerList(daemonId: string): Observable<any>{
        const socket = new RxSocket(environment.socketServer); 

        const event$ = socket.observable(`ui-${daemonId}-${Events.CONTAINERS_LIST}`);
        return event$;

      }

      public getInfo(daemonId: string): Observable<any>{
        const socket = new RxSocket(environment.socketServer); 

        const event$ = socket.observable(`ui-${daemonId}-${Events.DOCKER_ENGINE_INFO}`);
        return event$;
      }

      public getDisk(daemonId: string): Observable<any>{
        const socket = new RxSocket(environment.socketServer); 

        const event$ = socket.observable(`ui-${daemonId}-${Events.DISK_USAGE}`);
        return event$;
      }

}



