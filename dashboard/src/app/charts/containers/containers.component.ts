import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { Engine } from '../../core/models/engine.model';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  @Input('daemonId') daemonId: string;
  public info: Engine;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public pieChartLabels: Label[] = ['Running', 'Stopped', 'Paused'];
  public pieChartData: SingleDataSet = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  private subscribers: Subscription[] = [];

  constructor(private socketService: SocketService) { }

  ngOnDestroy(): void {
  this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
    this.subscribers.push(
      this.socketService.getInfo(this.daemonId)
      .subscribe((data:Engine)=> {
        
        this.pieChartData = [data.containerRunning,data.containerStopped,data.containerPaused]
       
      })
    );

    
  }

}
