import { Injectable } from "@nestjs/common";
import { Container } from "src/engine/models/container.model";
import { ContainerMetrics } from "../engine/models/container-metrics.model";
import { DiskUsage } from "../engine/models/disk-usage.model";
import { DockerEngine } from "../engine/models/docker-engine.model";
import { MemoryUsage } from "../engine/models/memory-usage.model";
var shellParser = require('node-shell-parser');

@Injectable()
export class UtilService{
    constructor(){}

    public parseEngineMemory(stdout: string): MemoryUsage{
        const result = this.parseStdout(stdout);
        if(result){
          return {
            total:this.getNumber(result[0].total),
            free: this.getNumber(result[0].free),
            used: this.getNumber(result[0].used),
            dateTime: new Date()
          }
        }
    }

    public parseEngineDisk(stdout: string): DiskUsage{
      const result = this.parseStdout(stdout);
      if(result){
        return {
          size: this.getNumber(result[0].Size),
          free: this.getNumber(result[0].Avail),
          used: this.getNumber(result[0].Used),
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
                    memoryPerc: this.getNumber(obj["MemPerc"]),
                    memoryUsage: this.getNumber(obj["MemUsage"]),
                    cpuPerc: this.getNumber(obj["CPUPerc"]),
                    name: obj["Name"],
                    blockIo: this.getNumber(obj["BlockIO"]),
                    
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
                  memoryPerc: this.getNumber(obj["MemPerc"]),
                  memoryUsage:this.getNumber(obj["MemUsage"].split('/')[0]),
                  cpuPerc: this.getNumber(obj["CPUPerc"]),
                  name: obj["Name"],
                  blockIo: this.getNumber(obj["BlockIO"]),
                    
                }
            
        }

        return containersMetrics;
    }

  private  parseStdout = (input) => {
       
    return shellParser(input);

  }

  getNumber(str: string): number{
    const floatRegex =  /[+-]?([0-9]*[.])?[0-9]+/;
    return  str.match(floatRegex).map(function(v) { return parseFloat(v); })[0];
  }
}