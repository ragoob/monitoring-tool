import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../models/menu.model';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems$: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([])
  constructor(private serverService: ServerService) { 

  }

  loadMenu(){
   this.menuItems$.next(this.serverService.getAll().map((server=>{
     return {
       title: server.name,
       route: server.host
     }
   })))
  }
}
