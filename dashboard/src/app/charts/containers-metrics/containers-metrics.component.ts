import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { ContainerMetrics } from '../../core/models/container-metrics.model';
import { SocketService } from '../../core/services/socket-io.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexYAxis
} from "ng-apexcharts";
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis
};

@Component({
  selector: 'app-containers-metrics',
  templateUrl: './containers-metrics.component.html',
  styleUrls: ['./containers-metrics.component.scss']
})
export class ContainersMetricsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input('daemonId') daemonId: string;
  private subscribers: Subscription[] = [];
  public loaded: boolean = false;
  constructor(private socketService: SocketService,
    private spinner: NgxSpinnerService
    ) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

 

  ngOnInit() {
    this.spinner.show('ContainersMetricsComponent');
    this.loadOptions();
    this.subscribers.push(
      this.socketService.getContainerUsage(this.daemonId)
      .pipe(distinct())
      .subscribe((data:ContainerMetrics[])=> {
  
        if(data && data.length > 0){
          this.chart.updateSeries([{
            data : data.map((item:ContainerMetrics)=> {
              return {
                x: item.name,
                y: item.memoryPerc
              }
            })
          }])

         

        }
        this.spinner.hide('ContainersMetricsComponent');
        this.loaded = true;
      })
    )

  }

  private loadOptions(){
    this.chartOptions = {
      series: [
        {
          name: "basic",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '15px'
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: "category"
      },
      yaxis: {
        min: 0,
        max: 100
      }
    };
  
}

}
