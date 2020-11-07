import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constant';
import { Machine } from '../models/machine.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private baseUrl?: string){

  }

  public saveMachine(model: Machine): Promise<Machine>{
    return this.http.post<Machine>(`${this.baseUrl}/machine`,model)
    .toPromise();
  }

  public getMachines(): Promise<Machine[]>{
    return this.http.get<Machine[]>(`${this.baseUrl}/machine/`)
    .toPromise();
  }

  public getMachine(id: string): Promise<Machine>{
    return this.http.get<Machine>(`${this.baseUrl}/machine/${id}`)
    .toPromise();
  }

  public listen(id: string): Promise<any>{
   return this.http.get(`${this.baseUrl}/machine/listen/${id}`)
    .toPromise();
  }
}
