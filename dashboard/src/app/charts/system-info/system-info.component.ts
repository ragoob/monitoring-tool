import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Engine } from '../../core/models/engine.model';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit, OnDestroy {
  @Input('daemonId') daemonId: string;
  public info: Engine;
  private subscribers: Subscription[] = [];

  constructor(private socketService: SocketService) { }

  ngOnDestroy(): void {
  this.subscribers.forEach(s=> s.unsubscribe());
  this.socketService.disconnect();
  }

  ngOnInit(): void {
    this.subscribers.push(
      this.socketService.getInfo(this.daemonId)
      .subscribe((data:Engine)=> {
        
        this.info = data;
      })
    );

    
  }

}
