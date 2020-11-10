import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { ContainerMetrics } from '../../core/models/container-metrics.model';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-containers-metrics',
  templateUrl: './containers-metrics.component.html',
  styleUrls: ['./containers-metrics.component.scss']
})
export class ContainersMetricsComponent implements OnInit {
  @Input('daemonId') daemonId: string;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'cpu',fill:false },
    { data: [], label: 'Meme',fill:false },
   
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors: Color[] = [
   

    {
      backgroundColor: 'rgba(85, 110, 230, 0.2)',
      borderColor: '#d6d8d9',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#d6d8d9',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 0.5,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#d6d8d9',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    },

    {
      backgroundColor: 'rgba(85, 110, 230, 0.2)',
      borderColor: '#ffd75a',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#fff3cd',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 0.5,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#ffd75a',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];
  private subscribers: Subscription[] = [];
  constructor(private socketService: SocketService) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit() {
    this.subscribers.push(
      this.socketService.getContainerUsage(this.daemonId)
      .pipe(distinct())
      .subscribe((data:ContainerMetrics[])=> {
  
        if(data && data.length > 0){
          this.lineChartData[0].data = data.map(d=> d.cpuPerc / 100);
          this.lineChartData[1].data = data.map(d=> d.memoryPerc / 100);
      
          this.lineChartLabels = data.map(d=> d.name);


        }
        
      
      })
    )

  }
}
