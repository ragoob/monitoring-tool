import { Injectable } from "@nestjs/common";
import { DockerEngine } from "../models/docker-engine.model";
import * as process from 'child_process';
import { UtilService } from "../../core/util.service";
import { MemoryUsage } from "../models/memory-usage.model";
import { Thermal } from "../models/thermal.model";
import { DiskUsage } from "../models/disk-usage.model";
import { CPU_USAGE, DISK_USAGE, DOCKER_INFO, MEMORY_USAGE } from "../../core/commands";

@Injectable()
export class EngineService{

    constructor(private util : UtilService){}

    // Get engine memory usage 

    public getMemoryInfo(): Promise<MemoryUsage>{

        return    new Promise((resolve, reject) => {
            process.exec(MEMORY_USAGE,(error: process.ExecException,stdout: string, stderr: string)=> {
                 if (error) {
                     return reject(error);
                 }
     
                 resolve(this.util.parseEngineMemory(stdout));
             });
         });
    }


    // get docker engine information

    public getDockerEngineInfo(): Promise<DockerEngine>{
        return    new Promise((resolve, reject) => {
            process.exec(DOCKER_INFO,(error: process.ExecException,stdout: string, stderr: string)=> {
                 if (error) {
                     return reject(error);
                 }
     
                 resolve(this.util.parseEngineInfo(stdout));
             });
         });
    }

    // monitoring temp in Celcius
    public getThermal(): Promise<Thermal> {   
    return new Promise((resolve,reject)=>{
        const temp = process.spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']);
        try {
            temp.stdout.on('data', function(data) {
                resolve({
                    temperature: data/1000,
                    dateTime: new Date()
                });
           })
        } catch (error) {
            reject(error);
        }
         
    });  
   }

   // disk usage 
   public getDiskUsage(): Promise<DiskUsage>{
    return    new Promise((resolve, reject) => {
        process.exec(DISK_USAGE,(error: process.ExecException,stdout: string, stderr: string)=> {
             if (error) {
                 return reject(error);
             }
 
             resolve(this.util.parseEngineDisk(stdout));
         });
     });
}

public healthCheck(): Promise<string>{
    const command = `echo I am $MACHINE_ID a live`;
    return    new Promise((resolve, reject) => {
        process.exec(command,(error: process.ExecException,stdout: string, stderr: string)=> {
             if (error) {
                 return reject(error);
             }
 
             resolve(stdout);
         });
     });
}


public getCpuUsage(): Promise<any>{

    return    new Promise((resolve, reject) => {
        process.exec(CPU_USAGE,(error: process.ExecException,stdout: string, stderr: string)=> {
             if (error) {
                 return reject(error);
             }
 
             resolve({
                used: parseFloat(stdout),
                dateTime: new Date()
             });
         });
     });
}

 
}