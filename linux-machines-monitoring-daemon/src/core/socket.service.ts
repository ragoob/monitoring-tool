
import { Injectable } from '@nestjs/common';
import { exception } from 'console';
import * as io from 'socket.io-client';
@Injectable()
export class SocketService {
  sockets: SocketIOClient.Socket[] = [];
  constructor() {
  

   this.getSocket().on('connect_error', (err) => {
     console.log(`connect_error`, err);
    });

    this.getSocket().on('connect_timeout', (timeout) => {
      console.log(`connect_timeout`, timeout);
    });

    this.getSocket().on('connect', () => {
      console.info('socket is connected')

    });

   

    this.getSocket().on('disconnect', (reason) => {
      console.log(`disconnect`, reason);
    });
    
  }

  public getSocket(){

    const socket = io.connect(process.env.SOCKET_SERVER,{
    reconnection: true,
    transports: ['websocket'],
    upgrade: false,
    timeout: 300000,
    rejectUnauthorized: false

  });

    return socket;
  }


  public emitEvent(event: string, data: any): any {

        const machineEvent: string = `${process.env.MACHINE_ID}-${event}`
         this.getSocket().emit(machineEvent,data);
      
  }

}