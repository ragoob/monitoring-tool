import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Containers } from '../../core/models/containers.model';
import { Events } from '../../core/models/events';
import { SocketService } from '../../core/services/socket-io.service';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { RunImageComponent } from '../../shared/run-image/run-image.component';

@Component({
  selector: 'app-containers-list',
  templateUrl: './containers-list.component.html',
  styleUrls: ['./containers-list.component.scss']
})
export class ContainersListComponent implements OnInit , OnDestroy{
  durationInSeconds = 5;
  containers: Containers[];
  @Input('daemonId') daemonId: string;
  subscribers: Subscription[] = [];
  constructor(private socketService: SocketService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    
    ) { }
  public ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }

  public ngOnInit(): void {
    this.subscribers.push(
      this.socketService.getContainerList(this.daemonId)
      .subscribe((data: Containers[])=>{
        this.containers = data;
      })
    )
    
  }

  public new(){
    const dialogRef = this.dialog.open(RunImageComponent,{
      width: '80%',
      //height: '80%',
     data: {
       daemonId: this.daemonId
     }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.snackBar.openFromComponent(NotificationComponent, {
          duration: this.durationInSeconds * 1000,
          panelClass: 'panel-success',
          data: {
            type: 'success',
            message: 'Run image command sent to machine successfuly'
          }
        });
      }
      
    });
  }

  private notification(message: string){
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
      data: {
        type: 'success',
        message: message
      }
    });
  }

  public restart(model: Containers){

    this.socketService.emit(`ui-${this.daemonId}-${Events.CONTAINER_RESTART}`,model.id);
    this.notification('Container restart command sent to daemon');
   

  
  }

  public start(model: Containers){
    this.socketService.emit(`ui-${this.daemonId}-${Events.CONTAINER_START}`,model.id);
    this.notification('Container start command sent to daemon');


  }

  public Stop(model: Containers){
   
    this.socketService.emit(`ui-${this.daemonId}-${Events.CONTAINER_STOP}`,model.id);
    this.notification('Container stop command sent to daemon');


  }

  public delete(model: Containers){
    this.socketService.emit(`ui-${this.daemonId}-${Events.CONTAINER_DELETE}`,model.id);
    this.notification('Container delete command sent to daemon');

  }

  public details(model: Containers){
    alert('feature under development');
  }


}
