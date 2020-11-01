import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketService } from './core/socket.service';
import {Response} from 'express'
import * as fs from 'fs';
import * as path from 'path'
import { rejects } from 'assert';
@Controller()
export class AppController {
  private logger: Logger = new Logger();
  private Listeners: string[] = [];
  constructor(private readonly appService: AppService,private socketService: SocketService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('listen/:id')
  healthcheck(@Res() res: Response, @Param('id') id: number){
  
    if(this.Listeners.findIndex(d=> d === id.toString()) === -1){
      this.socketService.startListen(id.toString());
      this.Listeners.push(id.toString());
    }
   
    else{
      console.log(`${id} is already registered`)
    }
   
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

  @Get('deployment/:id')
  async deployment(@Res() res: Response,@Param('id') id: number): Promise<void>{
    console.log('generate file')
    const file  = await this.read();
    const updatedfile = file.replace(/{Daemon_GUID}/g,id.toString());
    res.setHeader('Content-type', "application/octet-stream");
   res.setHeader('Content-disposition', `attachment; filename=dep-${id.toString()}.sh`);
   res.send(updatedfile); 
  }
  private async read(): Promise<string> {
  
    const _path: string = path.join(__dirname, '..','daemon-deploy.sh');
    return new Promise<string>((resolve, reject) => {
      fs.readFile(
        _path,
        (error: NodeJS.ErrnoException | null, data: Buffer) => {
          
          if (error) {
            reject(error);
          } else {
            resolve(data.toString());
          }
        },
      );
    });
  }
}
