import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Machine } from '../models/machine.model';
import { Menu } from '../models/menu.model';
import { MachineService } from './machine.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems$: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([])
  constructor(private machineService: MachineService) { 

  }

  loadMenu(){
   this.machineService.getMachines()
   .then(d=> {
     const menus: Menu[] = 
     d.map((item: Machine)=>{
       return {
         title: item.name,
         icon: "",
         route: `/${item.id}`
       }
     });

     this.menuItems$.next(menus);
   })
  }
}
