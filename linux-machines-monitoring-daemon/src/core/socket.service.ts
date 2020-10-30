
import { Injectable } from '@nestjs/common';
import * as io from 'socket.io-client';
import { URL } from 'url';
import { Events } from './events';
@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;
  constructor() {
     
   
   this.getSocket();
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
    try {
      this.socket.disconnect();
      this.socket.close();
    } catch (error) {
      
    }
    this.socket =  io(`${process.env.SOCKET_SERVER}`,{
      reconnection: false
    });
    return this.socket;
  }

  public emitEvent(event: string, data: any): any {

      try {
        const machineEvent: string = `${process.env.MACHINE_ID}-${event}`
        if(event === Events.MEMORY_USAGE){
          console.log(`${new Date().toLocaleTimeString('it-IT')} push on ${machineEvent}`)

        }
         this.getSocket().emit(machineEvent,data);
      } catch (error) {
        console.log(`error in sending data ${error}`)
      }
  }

}