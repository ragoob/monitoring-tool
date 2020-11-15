import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Containers } from '../../core/models/containers.model';
import { Engine } from '../../core/models/engine.model';
import { SocketService } from '../../core/services/socket-io.service';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any;
};

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input('daemonId') daemonId: string;
  public info: Engine;

  public pieChartLegend = true;
  public pieChartPlugins = [];
  private subscribers: Subscription[] = [];
  
  constructor(private socketService: SocketService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnDestroy(): void {
  this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
    this.spinner.show('ContainersComponent');
    this.chartOptions = {
      series: [0, 0,0],
      
      chart: {
        width: '100%',
        height: '200px',
        type: "pie",
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
      }
      },
      
      colors: ['#1ee2ac', '#dc3545', '#ff7750'],
      labels: ["Running","Exited","Paused"],
    
  
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            
          
            },
            legend: {
              position: "bottom"
            
            }
          }
        }
      ]
    };

    this.subscribers.push(
      this.socketService.getContainerList(this.daemonId)
      .subscribe((data:Containers[])=> {
        if(data.length > 0){
          const chartData: any[] = [
            data.filter(d=> d.isRunning).length,
            data.filter(d=> d.status === 'exited').length,
            data.filter(d=> d.paused).length
          ]

          this.chart.updateSeries([chartData[0],chartData[1],chartData[2]],true)
          this.spinner.hide('ContainersComponent');

        }
       
       
      })
    );

    
  }

}
