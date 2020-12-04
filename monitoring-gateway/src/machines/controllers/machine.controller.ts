import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Machine } from '../models/machine.entity';
import {Response} from 'express'
import * as fs from 'fs';
import * as path from 'path'
import { MachineService } from '../services/machine.service';
import { JwtAuthGuard } from '../../authentication/services/jwt.auth.guard';
import { DeleteResult } from 'typeorm';

@Controller('machine')
export class MachineController  {
    constructor(private machineService: MachineService){

    }


    @Post()
    @UseGuards(JwtAuthGuard)
    public  saveConfigurations(@Body() machine: Machine): Promise<Machine>{
      return this.machineService.saveConfiguration(machine);
       
      
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    public  delete(@Res() res: Response ,@Param('id') id: string): Promise<DeleteResult>{
      return this.machineService.delete(id);
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
     deployment(@Res() res: Response,@Param('id') id: string): Promise<Response<any>>{
      const filePath: string = path.join(__dirname,'..','..','daemon-deploy.sh');
      return new Promise <Response<any>>((resolve,rejects)=>{
        this.read(filePath)
          .then(file=> {
            const URL = process.env.SOCKET_SERVER_URL;
            const updatedfile = file.replace(/{Daemon_GUID}/g, id).replace(/{SOCKET_SERVER_URL}/g, URL);
            res.setHeader('Content-type', "application/octet-stream");
            res.setHeader('Content-disposition', `attachment; filename=dep-${id.toString()}.sh`);
            resolve(res.send(updatedfile)); 
        });
      });

    }
  
  
    @Get('deamonBuild/download')
     download(@Res() res: Response){
      const _path: string = path.join(__dirname,'..','..','build.tar.gz');
       res.download(_path);
      return;
    }

    private  read(path: string): Promise<string> {
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