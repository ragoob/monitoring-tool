
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService implements OnModuleInit {
  public  socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect(process.env.SOCKET_SERVER, {
      reconnection: true,
      reconnectionDelay: 3000,
      transports: ['websocket'],
      upgrade: false,
      timeout: 300000,
      rejectUnauthorized: false
    });
   
  }
  onModuleInit() {
    this.socket.on('connect',()=>{
      console.log('socket is connected to server')
      this.socket.emit('ping',"{message: 'hello from client'}")
    })
    this.socket.on('connect_error', (err) => {
    
      console.log('error during socket connection', err);
      this.socket.open();
      this.socket.connect();
    });

    this.socket.on('connect_timeout', (timeout) => {
      console.log('socket connection timeout');
    
    });

  

    this.socket.on('disconnect', (reason) => {
      console.log('connection closed with reason  ', reason);
    
    });
  }


  public emitEvent(event: string, data: any): any {

    this.socket.emit(event, {
      machineId: process.env.MACHINE_ID,
      data: data
    });
      
  }

  

}