
import { Injectable } from '@nestjs/common';
import { exception } from 'console';
import * as io from 'socket.io-client';
@Injectable()
export class SocketService {
  sockets: SocketIOClient.Socket[] = [];
  constructor() {
  

   this.getSocket().on('connect_error', (err) => {
     throw new exception(`connect_error ${err}`)
    });

    this.getSocket().on('connect_timeout', (timeout) => {
      throw new exception(`connect_timeout ${timeout}`)
    });

    this.getSocket().on('connect', () => {
      console.info('socket is connected')

    });

   

    this.getSocket().on('disconnect', (reason) => {
      throw new exception(`disconnect ${reason}`)
    });
    
  }

  public getSocket(){
  const socket =   io(process.env.SOCKET_SERVER,{
    reconnection: true,
    transports: ['websocket'],
    upgrade: false,
    timeout: 300000

  });

    return socket;
  }


  public emitEvent(event: string, data: any): any {
        const machineEvent: string = `${process.env.MACHINE_ID}-${event}`
         this.getSocket().emit(machineEvent,data);
      
  }

}