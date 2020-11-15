import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-disk-card',
  templateUrl: './disk-card.component.html',
  styleUrls: ['./disk-card.component.scss']
})
export class DiskCardComponent implements OnInit {

  private subscribers: Subscription[] = [];
  private sortedList: any[] = [];
  @Input('daemonId') daemonId: string;
  public usage: number;
  public avg: number;
  public usagePerc: number;
  public status: string = "success";
  constructor(
    private socketService: SocketService,
    private spinner: NgxSpinnerService
    
    ) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
    this.spinner.show(DiskCardComponent.name);
    this.subscribers.push(
      this.socketService.getDisk(this.daemonId)
      .subscribe((data: {size:number,used: number,free: number,dateTime:any})=> {
        this.sortedList.push(data);
        const sum = this.sortedList.map((item: {used: number})=>{return item.used;}).reduce((a, b) => a + b, 0);
        
        this.avg = Math.round((((sum / this.sortedList.length)) / data.size) * 100)
        this.usage = data.used;
        this.usagePerc = Math.round((data.used / data.size) * 100)
        if(this.usagePerc  > 60 && this.usagePerc < 90){
          this.status = "warning";
        }

        else if(this.usagePerc >=90){
         this.status = "danger";
        }
        else{
         this.status= "success"
        }

        this.spinner.hide(DiskCardComponent.name);

       
      })
    )

  }
}
