import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DockerEngineService } from '../core/services/docker-engine.service';
import { Engine } from '../core/models/engine.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ServerService } from '../core/services/server.service';
import { Label, SingleDataSet,Color } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../core/services/socket-io.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

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
  constructor(private http: HttpClient,private socketService: SocketService,private router: ActivatedRoute,private route: Router,private serverService: ServerService) {}
 
  ngOnDestroy(): void {
    
   this.subscribers.forEach(s=> s.unsubscribe());
  }
  ngOnInit(): void {
  
   
  this.router.params.subscribe
    (d=> {

      this.subscribers.forEach(s=> s.unsubscribe());
      this.connected = false;
      const id = d.id;
      this.daemonId = id;
      this.title = this.serverService.getAll().find(d=> d.host === id).name;
      this.http.get(`${environment.gateWay}/listen/${id}`)
       .toPromise()
       .then(d=> {
         this.subscribers.push(
          this.socketService.getDeamonAlive(id)
          .subscribe(s=> {
            console.log(s)
            this.connected = true;
            this.aliveMessages.push(s);
          })
         )
       
       })
    
     
    })
  }

  public copyScript(){
    const script: string = `curl ${environment.gateWay}/deployment/${this.daemonId} | sh`;
    const el = document.createElement('textarea');
    el.value = script;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
