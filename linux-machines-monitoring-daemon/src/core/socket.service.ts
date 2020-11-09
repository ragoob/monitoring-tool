
import { Injectable } from '@nestjs/common';
import * as io from 'socket.io-client';
@Injectable()
export class SocketService {
  sockets: SocketIOClient.Socket[] = [];
  constructor() {
  

   this.getSocket().on('connect_error', (err) => {
      console.log('error in connection ', err);
    });

    this.getSocket().on('connect_timeout', (timeout) => {
      console.log('timeout error', timeout);
    });

    this.getSocket().on('connect', () => {
      console.info('socket is connected')

    });

   

    this.getSocket().on('disconnect', (reason) => {
      console.info('disconnected',reason)
    });
    
  }

  public getSocket(){
  const socket =   io(process.env.SOCKET_SERVER,{
    reconnection: true,
<<<<<<< HEAD
    timeout: 1000 * 60 * 300,
    transports: ['websocket'],
    upgrade: false
=======
    timeout: 300000
    
>>>>>>> 5ba2c37b394e3a34646aba787b2f8f316e9025b1
  });

    return socket;
  }


  public emitEvent(event: string, data: any): any {
        const machineEvent: string = `${process.env.MACHINE_ID}-${event}`
         this.getSocket().emit(machineEvent,data);
      
  }

}