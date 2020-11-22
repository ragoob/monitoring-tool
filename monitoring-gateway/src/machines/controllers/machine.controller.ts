import { Body, Controller, Delete, Get, Logger, OnModuleInit, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Machine } from '../models/machine.entity';
import {Response} from 'express'
import * as fs from 'fs';
import * as path from 'path'
import { MachineService } from '../services/machine.service';
import { SocketService } from '../../core/socket.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../authentication/services/jwt.auth.guard';
@Controller('machine')

export class MachineController implements OnModuleInit {
    private logger: Logger = new Logger();

    private listeners: Map<string,boolean> = new Map<string,boolean>();

    constructor(private machineService: MachineService,
        private socketService: SocketService){

    }
  async onModuleInit() {
    this.logger.debug(`Start listen to sockets`)
   const machines = await this.machineService.getAll();
   machines.forEach(machine=> {
    this.socketService.startListen(machine.id.toString());
    this.listeners[machine.id] = true;
   });
  }

    @Post()
    @UseGuards(JwtAuthGuard)
    public async saveConfigurations(@Body() machine: Machine): Promise<Machine>{
       const createdMachine =  await this.machineService.saveConfiguration(machine);
       
       if(createdMachine){
        if(!this.listeners[createdMachine.id]){
          this.socketService.startListen(createdMachine.id.toString());
          this.listeners[createdMachine.id] = true;
        }
       }
       return createdMachine;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    public async delete(@Res() res: Response ,@Param('id') id: string){
  
      try {
        await this.machineService.delete(id);
        this.listeners.delete(id);
        this.socketService.removeListeners(id);
        this.logger.debug(`Stop and delete daemon ${id}`)
      } catch (error) {
        this.logger.debug(error);
      }
  
      res.status(200)
      .send({
        success: true
      });
    
      
       
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public getAll(): Promise<Machine[]>{
        return this.machineService.getAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    public getConfiguration(@Param('id') id: string): Promise<Machine>{
        return this.machineService.getById(id);
    }

    @Get('deployment/:id')
    async deployment(@Res() res: Response,@Param('id') id: string): Promise<void>{
      const _path: string = path.join(__dirname,'..','..','daemon-deploy.sh');
      const machine = await this.machineService.getById(id);
      if(!machine){
        res.status(400)
        .send("Machine does not exist");
        return;
      }
      const file  = await this.read(_path);
      const URL = process.env.SOCKET_SERVER_URL;
      console.log(URL)
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