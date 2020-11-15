import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket-io.service';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { animate } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-storage-usage',
  templateUrl: './storage-usage.component.html',
  styleUrls: ['./storage-usage.component.scss']
})
export class StorageUsageComponent implements OnInit , OnDestroy {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input('daemonId') daemonId: string;
 
  private subscribers: Subscription[] = [];
  constructor(private socketService: SocketService,
    private spinner: NgxSpinnerService
    
    ) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit() {
    this.spinner.show('StorageUsageComponent');
    this.chartOptions = {
      series: [0,0],
      chart: {
        width: '100%',
        height: '200px',
        type: "pie",
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800,
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
      labels: ["Used","Free"],
  
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.subscribers.push(
      this.socketService.getDisk(this.daemonId)
      .subscribe((disk: {size:number,used: number,free: number,dateTime:any})=> {
        if(disk && disk.size && disk.free){
          this.chart.updateSeries([disk.used, disk.free], true);
          this.spinner.hide('StorageUsageComponent');

        }
      
       
      })
    )
  }

}
