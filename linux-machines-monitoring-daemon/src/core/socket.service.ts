
import { Injectable } from '@nestjs/common';
import * as io from 'socket.io-client';
import { Events } from './events';
@Injectable()
export class SocketService {
  sockets: SocketIOClient.Socket[] = [];
  constructor() {
  

   this.getSocket().on('connect_error', (err) => {
      console.error('error in connection ', err);
    });

    this.getSocket().on('connect_timeout', (timeout) => {
      console.error('timeout error', timeout);
    });

    this.getSocket().on('connect', () => {
      console.info('socket is connected')

    });

   

    this.getSocket().on('disconnect', (reason) => {
      console.info('disconnected',reason)
    });
    
  }

  public getSocket(){
  const socket =   io.connect(process.env.SOCKET_SERVER,{
    reconnection: true
  });

    return socket;
  }


  public emitEvent(event: string, data: any): any {
        const machineEvent: string = `${process.env.MACHINE_ID}-${event}`
        if(event === Events.MEMORY_USAGE){
          console.log(`${new Date().toLocaleTimeString('it-IT')} push on ${machineEvent}`)

        }
         this.getSocket().emit(machineEvent,data);
      
  }

}