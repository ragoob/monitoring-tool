import { Injectable, Logger } from '@nestjs/common';
import * as process from 'child_process';
import { Container } from 'src/docker/models/container.model';
import { UtilService } from '../../core/util.service';
import { ContainerMetrics } from '../models/container-metrics.model';
import { CreateContainerOptions } from '../models/create-container-options.model';
import { DockerCommandResult } from '../models/docker.command.result';

@Injectable()
export class ContainerService {
  private logger: Logger = new Logger(ContainerService.name);
  constructor(private util: UtilService){

  }

  // get list of containers
  public getList(): Promise<Container[]>{
       const command: string = `docker inspect  $(docker ps -aq)`
      return    new Promise((resolve, reject) => {
       process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
            if (error) {
                return reject(error);
            }

            resolve(this.util.parseDockerContainers(stdout));
        });
    });
  }

  // restart container
  public restart(containerId: string,withAutoRestart?: boolean): Promise<DockerCommandResult>{
   const unLessStopped = withAutoRestart ? 'unless-stopped' : ''
   const command: string = `docker update --restart ${unLessStopped} ${containerId}`;
   return  new Promise((resolve, reject) => {
    process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
         if (error) {
          resolve({
            success: false,
            error: error
          })
         }
         resolve({
           success: true,
           stdout: stdout
         });
     });
 });

  }

  // start stopped container
  public start(containerId: string): Promise<DockerCommandResult>{
    const command: string = `docker start  ${containerId}`;
    return  new Promise((resolve, reject) => {
     process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
          if (error) {
           resolve({
             success: false,
             error: error
           })
          }
          resolve({
            success: true,
            stdout: stdout
          });
      });
  });
 
   }

   // stop container

   public stop(containerId: string): Promise<DockerCommandResult>{
    const command: string = `docker stop  ${containerId}`;
    return  new Promise((resolve, reject) => {
     process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
          if (error) {
           resolve({
             success: false,
             error: error
           })
          }
          resolve({
            success: true,
            stdout: stdout
          });
      });
  });
 
   }

   // rm container

  public killContainer(containerId: string) : Promise<DockerCommandResult>{
    const command: string = `docker rm -f ${containerId}`;
    return  new Promise((resolve, reject) => {
     process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
          if (error) {
           resolve({
             success: false,
             error: error
           })
          }
          resolve({
            success: true,
            stdout: stdout
          });
      });
  })

}

//create container from image

public createContainer(options: CreateContainerOptions) : Promise<DockerCommandResult>{
  const command: string = this.buildCreateContainerCommand(options);
  return  new Promise((resolve, reject) => {
   process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
        if (error) {
         resolve({
           success: false,
           error: error
         })
        }
        resolve({
          success: true,
          stdout: stdout
        });
    });
})

}


// show container logs
  public logs(containerId: string): Promise<string>{
    const command: string = `docker logs ${containerId}`;
    return  new Promise((resolve, reject) => {
      process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
           if (error) {
            return reject(error);
           }
           resolve(stdout);
       });
   });

  }

  // get metrics of a containers
  public metrics(containerId: string): Promise<ContainerMetrics>{
    const command: string = `docker stats --no-stream --format='{{json .}}' ${containerId}`;
    return  new Promise((resolve, reject) => {
      process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
           if (error) {
            return reject(error);
           }
           resolve(this.util.parseContainerMetrics(stdout));
       });
   });

  }

    // get metrics of a all containers
  public metricsAll(): Promise<ContainerMetrics[]>{
    const command: string = `docker stats --no-stream --format='{{json .}}'`;
    return  new Promise((resolve, reject) => {
      process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
           if (error) {
            return reject(error);
           }
           resolve(this.util.parseContainerListMetrics(stdout));
       });
   });

  }

  // build docker 

  private buildCreateContainerCommand(options: CreateContainerOptions): string{
    let command = `docker run `
    if(options.ports){
      const ports = options.ports.map((port)=>{
        return ` -p ${port.hostPort}:${port.containerPort} `
      });
     command += ` ${ports.join(' ')}`
    }

    if(options.envirnment){
      const env = options.envirnment.map((env)=>{
        return ` -e ${env.key}=${env.value} `
      });

      command += ` ${env.join(' ')}`
    }

    if(options.options){
      command += ` ${options.options.join(' -')}`
    }

    if(options.volumes){
      const volumes =  options.volumes.map((v)=>{
        return ` -v ${v} `
      });

      command += ` ${volumes.join(' ')}`
    }

    if(options.cmd){
      command += ` -c ${options.cmd}`
    }

    if(options.name){
      command += ` --name ${options.name}`
    }
    command += ` ${options.image}`
    return command;
  }
}
