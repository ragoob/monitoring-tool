import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Containers } from '../../core/models/containers.model';
import { ContainerService } from '../../core/services/container.service';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-containers-list',
  templateUrl: './containers-list.component.html',
  styleUrls: ['./containers-list.component.scss']
})
export class ContainersListComponent implements OnInit , OnDestroy{
  containers: Containers[];
  @Input('daemonId') daemonId: string;
  subscribers: Subscription[] = [];
  constructor(private socketService: SocketService) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
   this.socketService.disconnect();
  }

  ngOnInit(): void {
  
    this.subscribers.push(
      this.socketService.getContainerList(this.daemonId)
      .subscribe((data: Containers[])=>{
        console.log(data)
        this.containers = data;
      })
    )
    
  }

  public new(){
    
  }


  public restart(model: Containers){

  
  }

  public start(model: Containers){
   

  }

  public Stop(model: Containers){
   

  }

  public delete(model: Containers){
   

  }

  public details(model: Containers){

  }


}
