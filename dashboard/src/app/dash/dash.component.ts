import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DockerEngineService } from '../core/services/docker-engine.service';
import { Engine } from '../core/models/engine.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../core/services/server.service';
import { Label, SingleDataSet,Color } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../core/services/socket-io.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  public title: string;
  public daemonId: string;
  public aliveMessages: string[] = [];
  public connected: boolean = false;
  public disconnected: boolean = false;
  constructor(private http: HttpClient,private socketService: SocketService,private router: ActivatedRoute,private serverService: ServerService) {}
  ngOnInit(): void {
    this.router.params.subscribe
    (d=> {
      const id = d.id;
      this.daemonId = id;
      this.title = this.serverService.getAll().find(d=> d.name).name;
      this.http.get(`http://localhost:4002/listen/${id}`)
      .subscribe(d=> {
        // this.http.get(`http://localhost:4002/start/${id}`)
        // .subscribe(d=> {
          
        // })
        this.socketService.getDeamonAlive(id)
        .subscribe(s=> {
          this.connected = true;
          this.aliveMessages.push(s);
        })
      })
    
     
    })
  }
}
