import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { from } from 'rxjs';
import { AppService } from './app.service';
import { SocketService } from './core/socket.service';
import {Response} from 'express'
import { SocketChanels } from './core/socket-chanels';
@Controller()
export class AppController {
  private logger: Logger = new Logger();
  constructor(private readonly appService: AppService,private socketService: SocketService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('listen/:id')
  healthcheck(@Res() res: Response, @Param('id') id: number){
    console.log(id)
    this.socketService.startListen(id.toString())
    res.status(200).send({
      success: true
    })
    
  }

  @Get('emit')
  emit(@Res() res: Response){
    this.socketService.emit(`test-alive`,'Hello world from 123456789');
    res.status(200).send('done');
  }

  @Get('start/:id')
  start(@Res() res: Response,@Param('id') id: number){
    console.log(id)
    this.socketService.emit(`${id}-intial-info`,'test');
    res.status(200).send({
      success: true
    });
  }
}
