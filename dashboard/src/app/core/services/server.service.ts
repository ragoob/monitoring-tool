import { Injectable } from '@angular/core';
import { Server } from '../models/servers.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly cacheKey: string = 'DOCKER_ENGINES'

  constructor() { }

  public create(model: Server){
    let data: Server[] = JSON.parse(localStorage.getItem(this.cacheKey))
    if(!data){
      data = [];
    }

    data.push(model);
    localStorage.setItem(this.cacheKey,JSON.stringify(data));
  }

  public getAll(): Server[]{
    let data: Server[] = JSON.parse(localStorage.getItem(this.cacheKey))
    if(!data){
      data = [];
    }
    return data;
  }

  public getByName(name: string): Server{
    const data: Server[] = JSON.parse(localStorage.getItem(this.cacheKey))
    console.log('data' ,data)
    return data.find(d=> d.name === name);
  }
}
