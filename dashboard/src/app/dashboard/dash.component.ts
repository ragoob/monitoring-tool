import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../core/services/socket-io.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { MachineService } from '../core/services/machine.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../shared/notification/notification.component';
import { NewEngineComponent } from '../shared/new-engine/new-engine.component';
import { MatDialog } from '@angular/material/dialog';
import { Machine } from '../core/models/machine.model';
import { ConfirmationService } from 'primeng/api';
import { MenuService } from '../core/services/menu.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit , OnDestroy{
  public machine: Machine
  durationInSeconds: number = 5;
  public title: string;
  public daemonId: string;
  public aliveMessages: string[] = [];
  public connected: boolean = false;
  public disconnected: boolean = false;
  private subscribers: Subscription[] = [];
  constructor(private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router,
    private machineService: MachineService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private menuService: MenuService

    
    ) {}
 
  ngOnDestroy(): void {
    
   this.subscribers.forEach(s=> s.unsubscribe());
  }
  ngOnInit(): void {
  this.route.params.subscribe
    (d=> {
      this.disconnected = false;
      this.connected = false;
      this.spinner.show('DashComponent');
      this.hideSpinnerTimeOut();
      this.subscribers.forEach(s=> s.unsubscribe());
      this.connected = false;
      this.machineService.getMachine(d.id)
      .then(machine=> {
        if(!machine){
          this.router.navigate(['/']);
          return;
        }
        this.machine = machine;
        this.daemonId = machine.id;
        this.title= `Dashboard ${machine.name}`;
        this.subscribers.push(
          this.socketService.getDeamonAlive(machine.id)
          .subscribe(s=> {
            this.connected = true;
            this.spinner.hide('DashComponent');
            this.aliveMessages.push(s);
          })
         )
      });
    })
  }

  public copyScript(){
    const script: string = `curl -k ${environment.gateWay}/machine/deployment/${this.daemonId} | sh`;
    const el = document.createElement('textarea');
    el.value = script;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: 'panel-success',
      data: {
        type: 'success',
        message: 'Script copied successfully'
      }
    });
  }

  public editEngine(){
    const dialogRef = this.dialog.open(NewEngineComponent,{
      width: '700px',
      height: '200px',
      data: {
        id: this.machine.id,
        name: this.machine.name,
        actiontype: "edit"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.title =  `Dashboard ${result.data.name}`;
        this.snackBar.openFromComponent(NotificationComponent, {
          duration: this.durationInSeconds * 1000,
          panelClass: 'panel-success',
          data: {
            type: 'success',
            message: 'Machine has been updated'
          }
        });
      }
      
    });
   
  }

  private hideSpinnerTimeOut(){
    setTimeout(() => {
      this.spinner.hide('DashComponent');
      if(!this.connected){
       this.title = `${this.title}`
       this.disconnected = true;
      }
      else{
        this.title = `${this.title}`
        this.connected = true;

      }
    }, 30 * 1000);
  }

  public deleteMachine(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this machine ?',
      accept: () => {
          this.spinner.show('DashComponent');
          this.machineService.deleteMachine(this.machine)
          .then(d=> {
            const menu = this.menuService.menuItems$.value;
            const deletedIndex: number =  menu[1].children.findIndex(c=> c.id == this.machine.id);
            
            menu[1].children.splice(deletedIndex,1);
            this.menuService.menuItems$.next(menu);
            this.socketService.emit('shutdown',{
              daemonId: this.daemonId
            });
            this.spinner.hide('DashComponent');
            this.router.navigate(['/']);
          },error=>{
            this.spinner.hide('DashComponent')

            this.snackBar.openFromComponent(NotificationComponent, {
              duration: this.durationInSeconds * 1000,
              panelClass: 'panel-success',
              data: {
                type: 'error',
                message: `Failed to delete machine ${error}`
              }
            });
          }).catch(reason=> {
            this.spinner.hide('DashComponent')

            this.snackBar.openFromComponent(NotificationComponent, {
              duration: this.durationInSeconds * 1000,
              panelClass: 'panel-success',
              data: {
                type: 'error',
                message: `Failed to delete machine ${reason}`
              }
            });
          })
          
      }
  });
  }
}
