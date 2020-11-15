import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinct, first, share } from 'rxjs/operators';
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
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-cpu-temperature',
  templateUrl: './cpu-temperature.component.html',
  styleUrls: ['./cpu-temperature.component.scss']
})
export class CpuTemperatureComponent implements OnInit, OnDestroy{
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public loaded: boolean = false;
  @Input('daemonId') daemonId : string;
  private sortedList: any[] = [];
  private subscribers: Subscription[] = [];
  constructor(private socketService: SocketService,
    private spinner: NgxSpinnerService
    ) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }


  ngOnInit() {
    this.spinner.show('CpuTemperatureComponent');
    this.fillChartOPtions();
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
        
         this.chart.updateSeries([{
          data: this.sortedList.map((item: {temperature:number,dateTime:any})=>{
            return {
              x: item.dateTime.toLocaleTimeString('it-IT'),
              y: item.temperature
            }
          }),
          color: "rgb(255, 119, 80)"
        }])

        this.spinner.hide('CpuTemperatureComponent');
        this.loaded = true;

      })
    )
 
  }

  private fillChartOPtions(){
    this.chartOptions = {
      series: [
        {
          name: "Memory usage",
          data: []
        }
      ],
      chart: {
        height: 350,
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
        curve: 'smooth',
        lineCap: 'square',
         width : 2
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
        type: "category"
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
       
      },
      legend: {
        show: false
      },
      
    };
  }

}
