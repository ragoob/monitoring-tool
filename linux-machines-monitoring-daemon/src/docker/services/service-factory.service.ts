import { Injectable, Logger } from "@nestjs/common";
import {SocketService } from "../../core/socket.service";
import { ContainerService } from "./container.service";
import { EngineService } from "./engine.service";

@Injectable()
export class ServiceFactory{
    private readonly logger = new Logger(ServiceFactory.name);

  constructor(private engine: EngineService, private continerService: ContainerService){
   
      
  }

  public async healthcheck(): Promise<any> {
    const result = await this.engine.healthCheck();
     return result;
}

public async dockerInfo(): Promise<any> {
    const result = this.engine.getDockerEngineInfo();
  
    return result;
}

public async containersList() : Promise<any> {
    const result = await this.continerService.getList();
   
    return result;
    
}


public async containersUsage(): Promise<any> {
    const result = await this.continerService.metricsAll();
  
    return result;
}

public async diskUsage(): Promise<any> {
    const result = await this.engine.getDiskUsage();
  
    return result;
  
}

public async thermal(): Promise<any> {
    const result = await this.engine.getThermal();
    return result;
  
}

public async memoryUsage(): Promise<any>  {
    const result = await this.engine.getMemoryInfo();
   
    return result;
 
}



}