import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MenuService } from '../../core/services/menu.service';
import {MatDialog} from '@angular/material/dialog';
import { NewEngineComponent } from '../../shared/new-engine/new-engine.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { Guid } from "guid-typescript";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  durationInSeconds = 5;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
     public menuService: MenuService, 
     public dialog: MatDialog
    ,private snackBar: MatSnackBar,
    public authService: AuthService
    
    ) {}

  public ngOnInit(): void {

   this.menuService.loadMenu(this.authService.getUser());
  }

  public addNewEngine(){
    const dialogRef = this.dialog.open(NewEngineComponent,{
      width: '700px',
      height: '200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.snackBar.openFromComponent(NotificationComponent, {
          duration: this.durationInSeconds * 1000,
          panelClass: 'panel-success',
          data: {
            type: 'success',
            message: 'Machine has been added'
          }
        });
      }
      
    });
   
  }

  public selectedItem(event){

  }
  public logOut(){
    this.authService.logOut();
  }

}
