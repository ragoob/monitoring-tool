import { Injectable, Logger } from "@nestjs/common";
import { ContainerService } from "./container.service";
import { EngineService } from "./engine.service";

@Injectable()
export class ServiceFactory{
    private readonly logger = new Logger(ServiceFactory.name);

  constructor(private engine: EngineService, private continerService: ContainerService){
   
      
  }

  public  healthcheck(): Promise<any> {
    return this.engine.healthCheck();
    
}

public  dockerInfo(): Promise<any> {
    return this.engine.getDockerEngineInfo();
  
    
}

public  containersList() : Promise<any> {
    return this.continerService.getList();
   
   
    
}


public  containersUsage(): Promise<any> {
    return this.continerService.metricsAll();
  
}

public  diskUsage(): Promise<any> {
    return  this.engine.getDiskUsage();
    
}

public  thermal(): Promise<any> {
 return this.engine.getThermal();
    
}

public  memoryUsage(): Promise<any>  {
   return  this.engine.getMemoryInfo();

 
}

public  cpuUsage(): Promise<any>  {
    return  this.engine.getCpuUsage();
 }

public  startContainer(containerId: string): Promise<any>  {
     return this.continerService.start(containerId);
  
 
}

public  stopContainer(containerId: string): Promise<any>  {
    return  this.continerService.stop(containerId);
  
 
}

public  deleteContainer(containerId: string): Promise<any>  {
   return  this.continerService.killContainer(containerId);
  
}

public  restartContainer(containerId: string): Promise<any>  {
    return   this.continerService.restart(containerId);
   
 
}

public  runImage(data: any): Promise<any>  {
   return  this.continerService.createContainer(data);
    
 
}

public  containerLogs(containerId: string): Promise<string>  {
    return   this.continerService.logs(containerId);
   
 
}



}