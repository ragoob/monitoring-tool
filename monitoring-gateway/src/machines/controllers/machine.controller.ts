import { Body, Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { Machine } from '../models/machine.entity';
import {Response} from 'express'
import * as fs from 'fs';
import * as path from 'path'
import { MachineService } from '../services/machine.service';
import { SocketService } from '../../core/socket.service';
@Controller('machine')
export class MachineController {
    private logger: Logger = new Logger();

    private Listeners: string[] = [];

    constructor(private machineService: MachineService,
        private socketService: SocketService){

    }

    @Post()
    public saveConfigurations(@Body() machine: Machine): Promise<Machine>{
        return this.machineService.saveConfiguration(machine);
    }

    @Get()
    public getAll(): Promise<Machine[]>{
        return this.machineService.getAll();
    }

    @Get(':id')
    public getConfiguration(@Param('id') id: string): Promise<Machine>{
        return this.machineService.getConfiguration(id);
    }

    @Get('listen/:id')
    async healthcheck(@Res() res: Response, @Param('id') id: string){
    
      const machine = await this.machineService.getConfiguration(id);
      if(!machine){
        res.status(400)
        .send("Machine does not exist");
        return;
      }
      
      if(this.Listeners.findIndex(d=> d === id.toString()) === -1){
        this.socketService.startListen(id.toString());
        this.Listeners.push(id.toString());
      }
     
      else{
        this.logger.log(`${id} is already registered`);
      }
     
      res.status(200).send({
        success: true
      })
      
    }
  
   
    @Get('deployment/:id')
    async deployment(@Res() res: Response,@Param('id') id: string): Promise<void>{
      const _path: string = path.join(__dirname,'..','..','daemon-deploy.sh');
      const machine = await this.machineService.getConfiguration(id);
      if(!machine){
        res.status(400)
        .send("Machine does not exist");
        return;
      }
      const file  = await this.read(_path);
      const URL = process.env.SOCKET_SERVER_URL;
      const updatedfile = file.replace(/{Daemon_GUID}/g,id.toString()).replace(/{SOCKET_SERVER_URL}/g,URL);
      
      res.setHeader('Content-type', "application/octet-stream");
     res.setHeader('Content-disposition', `attachment; filename=dep-${id.toString()}.sh`);
     res.send(updatedfile); 
    }
  
  
    @Get('deamonBuild/download')
    async download(@Res() res: Response){
      const _path: string = path.join(__dirname,'..','..','build.tar.gz');
      this.logger.debug('build path is ',_path)
       res.download(_path);
    }

    private async read(path: string): Promise<string> {
    
     // const _path: string = path.join(__dirname,'daemon-deploy.sh');
      return new Promise<string>((resolve, reject) => {
        fs.readFile(
          path,
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
