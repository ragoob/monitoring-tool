import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      this.spinner.show('DashComponent');
      this.hideSpinnerTimeOut
      this.subscribers.forEach(s=> s.unsubscribe());
      this.connected = false;
      this.machineService.getMachine(d.id)
      .then(machine=> {
        this.daemonId = machine.id;
        this.title= `Dashboard ${machine.name}`;
        this.subscribers.push(
          this.socketService.getDeamonAlive(machine.id)
          .subscribe(s=> {
            this.connected = true;
            this.spinner.hide();
            this.aliveMessages.push(s);
          })
         )
      });
    })
  }

  public copyScript(){
    const script: string = `curl ${environment.gateWay}/machine/deployment/${this.daemonId} | sh`;
    const el = document.createElement('textarea');
    el.value = script;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  private hideSpinnerTimeOut(){
    setTimeout(() => {
      this.spinner.hide('DashComponent');
      if(!this.connected){
       this.title = `${this.title} disconnected`
      }
      else{
        this.title = `${this.title} connected`

      }
    }, 60000);
  }
}
