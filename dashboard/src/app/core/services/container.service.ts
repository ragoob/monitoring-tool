import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Containers } from '../models/containers.model';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor(private http: HttpClient) { }

  public containerList(host: string): Promise<Containers[]>{
    return this.http.get<Containers[]>(`${host}/container`).toPromise();
  }

  public containermetrics(host: string): Promise<Containers[]>{
    return this.http.get<Containers[]>(`${host}/container/metrics`).toPromise();
  }

  public delete(host: string,id: string): Promise<any>{
    return this.http.delete<Containers[]>(`${host}/container/${id}`).toPromise();
  }

  public restart(host: string,id: string,autoRestart: boolean): Promise<any>{
    const body = {
      id: id,
      autoRestart: autoRestart
    };
    return this.http.put<Containers[]>(`${host}/container/restart/`,body).toPromise();
  }

  public start(host: string,id: string,autoRestart: boolean): Promise<any>{
    const body = {
      id: id,
      autoRestart: autoRestart
    };
    return this.http.put<Containers[]>(`${host}/container/start/`,body).toPromise();
  }

  public stop(host: string,id: string,autoRestart: boolean): Promise<any>{
    const body = {
      id: id,
      autoRestart: autoRestart
    };
    return this.http.put<Containers[]>(`${host}/container/stop/`,body).toPromise();
  }


}
