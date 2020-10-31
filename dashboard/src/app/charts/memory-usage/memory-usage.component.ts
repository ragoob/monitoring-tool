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
  private sortedList: any[] = [];
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
      borderWidth:1
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
  }

  ngOnInit() {
    this.loading = true;
    this.subscribers.push(
      this.socketService.getDeamonMemoryUsage(this.daemonId)
      .subscribe((data: {total:number,used:number,free:number,dateTime:any})=> {
         const date = new Date(data.dateTime);
         data.dateTime = date;
          this.sortedList.push(data);
          if(data.used && data.total && this.sortedList.length > 0){
            const avg =   this.sortedList.map(d=> d.used).reduce((a, b) => a + b) / this.sortedList.length;
  
            this.lineChartData[0].label = `(Avg Usage ${Math.round(avg)} / ${data.total})` ;
          }
      
         this.sortedList = this.sortedList.sort((a, b) => a.dateTime - b.dateTime )
         .slice(Math.max(this.sortedList.length - 20, 0))
         .sort((a, b) => a.dateTime - b.dateTime );
         this.lineChartData[0].data = this.sortedList.map(d=> d.used);
         this.lineChartLabels = this.sortedList.map(label=> label.dateTime.toLocaleTimeString('it-IT'));
         

      })
    )

  }

}
