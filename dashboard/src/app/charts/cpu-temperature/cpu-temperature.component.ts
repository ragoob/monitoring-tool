import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { distinct, first, share } from 'rxjs/operators';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-cpu-temperature',
  templateUrl: './cpu-temperature.component.html',
  styleUrls: ['./cpu-temperature.component.scss']
})
export class CpuTemperatureComponent implements OnInit, OnDestroy{
  @Input('daemonId') daemonId : string;
  private sortedList: any[] = [];
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Cpu temperature',fill:true },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors: Color[] = [
    {
            backgroundColor: 'rgba(85, 110, 230, 0.2)',
            borderColor: '#dc3545',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#dc3545',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#dc3545',
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
  constructor(private socketService: SocketService) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }


  ngOnInit() {
    this.subscribers.push(
      this.socketService.getDeamontemperature(this.daemonId)
      .pipe(distinct())
      .subscribe((data: {temperature: number,dateTime: any})=>{
        const date = new Date(data.dateTime);
        data.dateTime = date;
        this.sortedList.push(data); 
        this.sortedList = this.sortedList.sort((a, b) => a.dateTime - b.dateTime )
         .slice(Math.max(this.sortedList.length - 20, 0))
         .sort((a, b) => a.dateTime - b.dateTime );
        this.lineChartData[0].data = this.sortedList.map(d=> d.temperature);
        this.lineChartLabels = this.sortedList.map(label=> label.dateTime.toLocaleTimeString('it-IT'));
        if(data.temperature  && this.sortedList.length > 0){
          const avg =   this.sortedList.map(d=> d.temperature).reduce((a, b) => a + b) / this.sortedList.length;

          this.lineChartData[0].label = `(Avg temp ${Math.round(avg)} C)` ;
        }
      })
    )
 
  }

}
