import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Containers } from '../models/containers.model';
import { Engine } from '../models/engine.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DockerEngineService {
  constructor(private http: HttpClient) { 

  }

 

 
  public getEngine(host: string): Promise<Engine>{
    return this.http.get<Engine>(`${host}/engine`)
    .toPromise();
  }

  public getContainers(host: string): Promise<Containers[]>{
    return this.http.get<Containers[]>(`${host}/container`).toPromise();
  }
  
}
