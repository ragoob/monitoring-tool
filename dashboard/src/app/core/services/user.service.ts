import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constant';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, 
    @Inject(API_BASE_URL) private baseUrl?: string,) { }

  
  public create(user: User): Promise<User>{
    return this.http.post<User>(`${this.baseUrl}/user-management`,user).toPromise();
  }

  public update(user: User): Promise<User>{
    return this.http.put<User>(`${this.baseUrl}/user-management`,user).toPromise();
  }

  public delete(user: User): Promise<any>{
    return this.http.delete(`${this.baseUrl}/user-management/${user.id}`).toPromise();
  }

  public getById(id: number): Promise<User>{
   return this.http.get<User>(`${this.baseUrl}/user-management/${id}`).toPromise();
  }

  public get(): Promise<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}/user-management`).toPromise();
   }
 }

