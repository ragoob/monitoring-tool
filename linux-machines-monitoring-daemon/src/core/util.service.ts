import { Injectable } from "@nestjs/common";
import { Container } from "src/docker/models/container.model";
import { ContainerMetrics } from "../docker/models/container-metrics.model";
import { DiskUsage } from "../docker/models/disk-usage.model";
import { DockerEngine } from "../docker/models/docker-engine.model";
import { MemoryUsage } from "../docker/models/memory-usage.model";
var shellParser = require('node-shell-parser');

@Injectable()
export class UtilService{
    constructor(){}

    public parseEngineMemory(stdout: string): MemoryUsage{
        const result = this.parseStdout(stdout);
        if(result){
          return {
            total: parseFloat(result[0].total.replace(/\D/g,'')),
            free: parseFloat(result[0].free.replace(/\D/g,'')),
            used: parseFloat(result[0].used.replace(/\D/g,'')),
            dateTime: new Date()
          }
        }
    }

    public parseEngineDisk(stdout: string): DiskUsage{
      const result = this.parseStdout(stdout);
      if(result){
        return {
          size: parseFloat(result[0].Size.replace(/\D/g,'')),
          free: parseFloat(result[0].Avail.replace(/\D/g,'')),
          used: parseFloat(result[0].Used.replace(/\D/g,'')),
          dateTime: new Date()
        }
      }
  }

    public parseEngineInfo(stdout: string): DockerEngine{
        let engine: DockerEngine = new DockerEngine();
        if(stdout){
            const obj: {} = JSON.parse(stdout);
            engine = {
                id: obj["ID"],
                name : obj["Name"],
                containers: obj["Containers"],
                images: obj["Images"],
                operatingSystem: obj["OperatingSystem"],
                architecture: obj["Architecture"],
                version: obj["ServerVersion"],
                containerPaused: obj["ContainersPaused"],
                containerRunning: obj["ContainersRunning"],
                containerStopped: obj["ContainersStopped"] 
            }
        }
        return engine;
    }
    public parseDockerContainer(stdout: string): Container{
        let containers: Container = new Container();
        if(stdout){
            const obj: {} = JSON.parse(stdout);
            containers = 
                 {
                    id: obj["Id"],
                    name: obj["Name"].replace('/',''),
                    status: obj["State"]["Status"],
                    isRunning: obj["State"]["Running"],
                    restartCount: obj["RestartCount"],
                    createdAt: obj["Created"],
                    paused: obj["State"]["Paused"],
                    restarting: obj["State"]["Restarting"],
                    image: obj["Config"]["Image"],
                    ports: obj["NetworkSettings"]["Ports"],
                    ipAddress: obj["NetworkSettings"]["IPAddress"],
                    error:  obj["State"]["Error"],
                }
            
        }

        return containers;
        
    }

    public parseDockerContainers(stdout: string): Container[]{
        let containers: Container[] = [];
        if(stdout){
            const outPut: [] = JSON.parse(stdout);
            containers = outPut.map((obj: {})=>{
                return {
                    id: obj["Id"],
                    name: obj["Name"].replace('/',''),
                    status: obj["State"]["Status"],
                    isRunning: obj["State"]["Running"],
                    restartCount: obj["RestartCount"],
                    createdAt: obj["Created"],
                    paused: obj["State"]["Paused"],
                    restarting: obj["State"]["Restarting"],
                    image: obj["Config"]["Image"],
                    ports: obj["NetworkSettings"]["Ports"],
                    ipAddress: obj["NetworkSettings"]["IPAddress"],
                    error:  obj["State"]["Error"],
                }
            })
        }

        return containers;
        
    }


    public parseContainerListMetrics(stdout: string): ContainerMetrics[]{

        let containersMetrics: ContainerMetrics[] = [];
         if(stdout){
            containersMetrics =  stdout.split('\n').filter(obj=>  obj !== '' && obj !== ' ' && obj.trim().length > 0)
              .map((out: string)=> {
                  const obj = JSON.parse(out);
                  return {
                    id: obj["ID"],
                    memoryPerc: parseFloat(obj["MemPerc"].replace(/\D/g,'')),
                    memoryUsage: parseFloat(obj["MemUsage"].split('/')[0].replace(/\D/g,'')),
                    cpuPerc: parseFloat(obj["CPUPerc"].replace(/\D/g,'')),
                    name: obj["Name"],
                    blockIo: parseFloat(obj["BlockIO"].replace(/\D/g,'')),
                    
                };
                  
              })
             
                  
             
         }
 
         return containersMetrics;
     }


    public parseContainerMetrics(stdout: string): ContainerMetrics{

       let containersMetrics: ContainerMetrics = new ContainerMetrics();
        if(stdout){
            const obj: {} = JSON.parse(stdout);
             containersMetrics = 
                 {
                  id: obj["ID"],
                  memoryPerc: parseFloat(obj["MemPerc"].replace(/\D/g,'')),
                  memoryUsage: parseFloat(obj["MemUsage"].split('/')[0].replace(/\D/g,'')),
                  cpuPerc: parseFloat(obj["CPUPerc"].replace(/\D/g,'')),
                  name: obj["Name"],
                  blockIo: parseFloat(obj["BlockIO"].replace(/\D/g,'')),
                    
                }
            
        }

        return containersMetrics;
    }

  private  parseStdout = (input) => {
       
    return shellParser(input);

  }

}