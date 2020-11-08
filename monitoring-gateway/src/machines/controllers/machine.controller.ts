import { Body, Controller, Get, Logger, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Machine } from '../models/machine.entity';
import {Response} from 'express'
import * as fs from 'fs';
import * as path from 'path'
import { MachineService } from '../services/machine.service';
import { SocketService } from '../../core/socket.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../authentication/services/jwt.auth.guard';
@Controller('machine')

export class MachineController {
    private logger: Logger = new Logger();

    private Listeners: Map<string,boolean> = new Map<string,boolean>();

    constructor(private machineService: MachineService,
        private socketService: SocketService){

    }

    @Post()
    @UseGuards(JwtAuthGuard)
    public saveConfigurations(@Body() machine: Machine): Promise<Machine>{
        return this.machineService.saveConfiguration(machine);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public getAll(): Promise<Machine[]>{
        return this.machineService.getAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    public getConfiguration(@Param('id') id: string): Promise<Machine>{
        return this.machineService.getConfiguration(id);
    }

    @Get('listen/:id')
    @UseGuards(JwtAuthGuard)
    async healthcheck(@Res() res: Response, @Param('id') id: string){
    
      const machine = await this.machineService.getConfiguration(id);
      if(!machine){
        res.status(400)
        .send("Machine does not exist");
        return;
      }
      
      this.logger.debug(this.Listeners)
      if(!this.Listeners[id]){
        this.socketService.startListen(id.toString());
        //this.Listeners[id] = true;
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