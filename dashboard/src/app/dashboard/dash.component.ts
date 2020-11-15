import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Engine } from '../core/models/engine.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Label, SingleDataSet,Color } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../core/services/socket-io.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { MachineService } from '../core/services/machine.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit , OnDestroy{
  public title: string;
  public daemonId: string;
  public aliveMessages: string[] = [];
  public connected: boolean = false;
  public disconnected: boolean = false;
  private subscribers: Subscription[] = [];
  constructor(private socketService: SocketService,
    private router: ActivatedRoute,
    private route: Router,
    private machineService: MachineService,
    private spinner: NgxSpinnerService
    
    ) {}
 
  ngOnDestroy(): void {
    
   this.subscribers.forEach(s=> s.unsubscribe());
  }
  ngOnInit(): void {
  this.router.params.subscribe
    (d=> {
      this.spinner.show();
      this.subscribers.forEach(s=> s.unsubscribe());
      this.connected = false;

      this.machineService.getMachine(d.id)
      .then(machine=> {
        console.log(machine)
        this.daemonId = machine.id;
        this.title= `Dashboard ${machine.name}`;
        this.subscribers.push(
          this.socketService.getDeamonAlive(machine.id)
          .subscribe(s=> {
            console.info('connected')
            this.connected = true;
            this.spinner.hide();
            this.aliveMessages.push(s);
          })
         )
      });
      
      
    
     
    })
  }

  public copyScript(){

    //curl -k http://192.168.1.7/machine/deployment/6b5ada7a-a941-e5e2-8302-b8113f8c2006 | sh
    
    const script: string = `curl ${environment.gateWay}/machine/deployment/${this.daemonId} | sh`;
    const el = document.createElement('textarea');
    el.value = script;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
