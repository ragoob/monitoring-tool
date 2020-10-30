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

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Cpu temperature',fill:false },
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
    this.socketService.disconnect();
   this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit() {
    this.subscribers.push(
      this.socketService.getDeamontemperature(this.daemonId)
      .pipe(distinct())
      .subscribe((result: {temperature: number,dateTime: any})=>{

        this.lineChartData[0].data.push(result.temperature);
        this.lineChartLabels.push(new Date(result.dateTime).toLocaleTimeString('it-IT'));

      


      })

      

    )
 
  }

}
