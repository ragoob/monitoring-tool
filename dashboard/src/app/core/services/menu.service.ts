import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MENU_HOME, MENU_MANAGEMENT } from '../config/constants';
import { Machine } from '../models/machine.model';
import { Menu } from '../models/menu.model';
import { User } from '../models/user.model';
import { MachineService } from './machine.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems$: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([])
  constructor(private machineService: MachineService) { 

  }

  loadMenu(user: User){
   this.machineService.getMachines()
   .then(d=> {
     const menus: Menu[] = [
      MENU_HOME, 
      {
       label: 'Machines',
       faIcon: '',
       link: undefined,
       items: []
     }]
     menus[1].items = d
     .filter(c=> user.isAdmin || (user.allowedMachines && user.allowedMachines.includes(c.id)))
     .map((item: Machine)=>{
       return {
         label: item.name,
         faIcon: "",
         link: `/dashboard/${item.id}`
       }
     });
     if(user.isAdmin){
      MENU_MANAGEMENT.forEach(m=> menus.push(m));

     }
     this.menuItems$.next(menus);
   })
  }
}
