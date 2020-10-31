import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-storage-usage',
  templateUrl: './storage-usage.component.html',
  styleUrls: ['./storage-usage.component.scss']
})
export class StorageUsageComponent implements OnInit , OnDestroy {

  @Input('daemonId') daemonId: string;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Total', 'Used', 'Free'];
  public pieChartData: SingleDataSet = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Array < any > = [{
    backgroundColor: ['#556ee6', '#34c38f', '#f1b44c'],
    borderColor: ['#556ee6', '#34c38f', '#f1b44c']
 }];
  private subscribers: Subscription[] = [];
  constructor(private socketService: SocketService) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit() {
    this.subscribers.push(
      this.socketService.getDisk(this.daemonId)
      .subscribe((disk: {size:number,used: number,free: number,dateTime:any})=> {
         this.pieChartData = [disk.size,disk.used,disk.free]
      })
    )
  }

}
