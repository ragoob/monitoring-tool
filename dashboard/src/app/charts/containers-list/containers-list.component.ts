import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Containers } from '../../core/models/containers.model';
import { Events } from '../../core/models/events';
import { SocketService } from '../../core/services/socket-io.service';
import { NotificationComponent } from '../../shared/notification/notification.component';

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
  constructor(private socketService: SocketService,private snackBar: MatSnackBar) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
    this.subscribers.push(
      this.socketService.getContainerList(this.daemonId)
      .subscribe((data: Containers[])=>{
        this.containers = data;
      })
    )
    
  }

  public new(){
    alert('feature under development');
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
