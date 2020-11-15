import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../core/services/socket-io.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexMarkers,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
import { Subscription } from 'rxjs';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis,
  markers: ApexMarkers,
  legend: ApexLegend,
  fill: ApexFill
};


@Component({
  selector: 'app-cpu-usage',
  templateUrl: './cpu-usage.component.html',
  styleUrls: ['./cpu-usage.component.scss']
})
export class CpuUsageComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input('daemonId') daemonId: string;
  private sortedList: any[] = [];
  private subscribers: Subscription[] = [];
  public loading: boolean;
  constructor(private socketService: SocketService) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }
  ngOnInit() {
    this.fillChartOPtions();
    this.loading = true;
    this.subscribers.push(
      this.socketService.getDeamonCpuUsage(this.daemonId)
      .subscribe((data: {used:number,free:number,dateTime:any})=> {
         const date = new Date(data.dateTime);
         data.dateTime = date;
          this.sortedList.push(data);
         this.sortedList = this.sortedList.sort((a, b) => a.dateTime - b.dateTime )
         .slice(Math.max(this.sortedList.length - 20, 0))
         .sort((a, b) => a.dateTime - b.dateTime );

         this.chart.updateSeries([{
           data: this.sortedList.map((item: {used:number,dateTime:any})=>{
             return {
               x: item.dateTime.toLocaleTimeString('it-IT'),
               y: item.used
             }
           }),
           color: "rgb(220, 53, 69)"
         }])
       
      })
    )

  }

  private fillChartOPtions(){
    this.chartOptions = {
      series: [
        {
          name: "Cpu usage",
          data: []
        }
      ],
      chart: {
        width: '100%',
        type: "area",
        zoom: {
          enabled: false
        },
        stacked: false,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
    
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], 
          opacity: 0.5
        }
      },
     
      
      xaxis: {
        type: "category",
        labels: {
          show: false
        }
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      markers: {
        size: 0
      },
    
      yaxis: {
        labels: {
          show: false
        }
      },
      legend: {
        show: false
      },
      
    };
  }

}
