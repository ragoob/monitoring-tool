import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {Menu} from '../../../app/core/models/menu.model'
import { MenuService } from '../../core/services/menu.service';
import {MatDialog} from '@angular/material/dialog';
import { NewEngineComponent } from '../../shared/new-engine/new-engine.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
 
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public menuService: MenuService, public dialog: MatDialog) {}
  ngOnInit(): void {
   this.menuService.loadMenu();
  }

  public addNewEngine(){
    const dialogRef = this.dialog.open(NewEngineComponent,{
      width: '500px',
      height: '200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
   
  }

}
