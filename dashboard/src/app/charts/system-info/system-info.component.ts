import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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

  constructor(private socketService: SocketService,
    private spinner: NgxSpinnerService
    
    ) { }

  ngOnDestroy(): void {
  this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
    this.spinner.show(SystemInfoComponent.name);
    this.subscribers.push(
      this.socketService.getInfo(this.daemonId)
      .subscribe((data:Engine)=> {
        
        this.info = data;
        this.spinner.hide(SystemInfoComponent.name);
      })
    );

    
  }

}
