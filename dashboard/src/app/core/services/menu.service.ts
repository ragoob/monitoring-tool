import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MENU_HOME, MENU_MANAGEMENT } from '../config/constants';
import { Machine } from '../models/machine.model';
import { NavItem } from '../models/nav-menu.model';
import { User } from '../models/user.model';
import { MachineService } from './machine.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems$: BehaviorSubject<NavItem[]> = new BehaviorSubject<NavItem[]>([])
  constructor(private machineService: MachineService) { 

  }

  loadMenu(user: User){
   this.machineService.getMachines()
   .then(d=> {
     const menus: NavItem[] = [
      MENU_HOME, 
      {
        displayName: 'Machines',
        iconName: 'device_hub',
        route: undefined,
        children: []
     }]
     menus[1].children = d
     .filter(c=> user.isAdmin || (user.allowedMachines && user.allowedMachines.includes(c.id)))
     .map((item: Machine)=>{
       return {
        displayName: item.name,
        iconName: "",
        route: `/dashboard/${item.id}`
       }
     });
     if(user.isAdmin){
      MENU_MANAGEMENT.forEach(m=> menus.push(m));

     }
     this.menuItems$.next(menus);
   })
  }
}
