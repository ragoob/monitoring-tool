
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService implements OnModuleInit {
  public  socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect(process.env.SOCKET_SERVER, {
      reconnection: true,
      reconnectionDelay: 3000
    });
   
  }
  onModuleInit() {
    this.socket.on('connect_error', (err) => {
    
   
    });

    this.socket.on('connect_timeout', (timeout) => {
    
    });

  

    this.socket.on('disconnect', (reason) => {
    
    });
  }


  public emitEvent(event: string, data: any): any {

    this.socket.emit(event, {
      machineId: process.env.MACHINE_ID,
      data: data
    });
      
  }

  

}