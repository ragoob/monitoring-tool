import { Injectable } from '@angular/core';
import { ThemeService } from 'ng2-charts';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as io from 'socket.io-client'
import { environment } from '../../../environments/environment';
import { Containers } from '../models/containers.model';
import { SocketEvents } from '../models/socket-events';
@Injectable()
export class SocketService{

    private socket: SocketIOClient.Socket;
    constructor(){
      this.getSocket();
    }
   

    private  getSocket() {
        const URL: string = environment.socketServer;
        this.socket =  io(URL);
        return this.socket;
    }

    public disconnect(){
        this.socket.disconnect();
    }

    public emit(event,data){
        this.getSocket().emit(event,data);
    }
    public getDeamonAlive(daemonId: string): Observable<string>{
      const socket = this.getSocket();     
      return  new Observable(observer=> {
            socket.on(`ui-${daemonId}-${SocketEvents.HEALTH_CHECK}`,(data: any)=>{
                console.log(data);
                observer.next(data)
            });

            return ()=> {
                socket.disconnect();
            }
        })
    }

    public getDeamontemperature(daemonId: string): Observable<any>{
      
        let observable =   new Observable(observer=> {
            const socket = this.getSocket();     
              socket.on(`ui-${daemonId}-${SocketEvents.TEMPERATURE}`,(data: any)=>{
                  observer.next(data)
              });
  
              return ()=> {
                  socket.disconnect();
              }
          })

          return observable;
      }

      public getDeamonMemoryUsage(daemonId: string): Observable<any>{

        let observable = new Observable(observer => {
            this.socket = this.getSocket();
            this.socket.on(`ui-${daemonId}-${SocketEvents.MEMORY_USAGE}`, (data) => {
              observer.next(data);    
            });
            return () => {
              this.socket.disconnect();
            };  
          })     

        return observable;
      }

      public getContainerUsage(daemonId: string): Observable<any>{

        let observable = new Observable(observer => {
            this.socket = this.getSocket();
            this.socket.on(`ui-${daemonId}-${SocketEvents.CONTAINERS_METRICS}`, (data) => {
              observer.next(data);    
            });
            return () => {
              this.socket.disconnect();
            };  
          })     

        return observable;
      }

      public getContainerList(daemonId: string): Observable<any>{

        let observable = new Observable(observer => {
            this.socket = this.getSocket();
            this.socket.on(`ui-${daemonId}-${SocketEvents.CONTAINERS_LIST}`, (data: Containers[]) => {
              observer.next(data);    
            });
            return () => {
              this.socket.disconnect();
            };  
          })     

        return observable;
      }

      public getInfo(daemonId: string): Observable<any>{
        let observable=   new Observable(observer=> {
            const socket = this.getSocket();     

              socket.on(`ui-${daemonId}-${SocketEvents.DOCKER_ENGINE_INFO}`,(data: any)=>{
                  console.log(data)
                  observer.next(data)
              });
  
              return ()=> {
                  socket.disconnect();
              }
          });

          return observable;

      }

      public getDisk(daemonId: string): Observable<any>{
        let observable=   new Observable(observer=> {
            const socket = this.getSocket();     

              socket.on(`ui-${daemonId}-${SocketEvents.DISK_USAGE}`,(data: any)=>{
                  console.log(data)
                  observer.next(data)
              });
  
              return ()=> {
                  socket.disconnect();
              }
          });

          return observable;

      }

}



