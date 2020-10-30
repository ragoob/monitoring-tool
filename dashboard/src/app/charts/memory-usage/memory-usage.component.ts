import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { distinct, first, share, take } from 'rxjs/operators';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-memory-usage',
  templateUrl: './memory-usage.component.html',
  styleUrls: ['./memory-usage.component.scss']
})
export class MemoryUsageComponent implements OnInit, OnDestroy {

  @Input('daemonId') daemonId: string;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Memory Usage',fill:false },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(85, 110, 230, 0.2)',
      borderColor: '#ffd75a',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#fff3cd',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#ffd75a',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];
  private subscribers: Subscription[] = [];
  public loading: boolean;
  constructor(private socketService: SocketService) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
   this.socketService.disconnect();
  }

  ngOnInit() {
    this.loading = true;
    this.subscribers.push(
      this.socketService.getDeamonMemoryUsage(this.daemonId)
      .subscribe((data: {total:number,used:number,free:number,dateTime:any})=> {

        if(data.used && data.total){
          
          this.lineChartData[0].label = `Memory Usage ${data.used} / ${data.total}` ;


        }
         this.lineChartData[0].data.push(data.used);
          this.lineChartLabels.push(new Date(data.dateTime).toLocaleTimeString('it-IT'))

      

      })
    )

  }

}
