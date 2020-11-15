import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-cpu-card',
  templateUrl: './cpu-card.component.html',
  styleUrls: ['./cpu-card.component.scss']
})
export class CpuCardComponent implements OnInit , OnDestroy{

  private subscribers: Subscription[] = [];
  private sortedList: any[] = [];
  @Input('daemonId') daemonId: string;
  public used: number;
  public avg: number;
  public status: string = "success";
  constructor( 
    private socketService: SocketService
    ) { }
  ngOnDestroy(): void {
   this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
   
    this.subscribers.push(
      this.socketService.getDeamonCpuUsage(this.daemonId)
      .subscribe((data: {used: number,dateTime: any})=>{
        const date = new Date(data.dateTime);
        data.dateTime = date;
        this.sortedList.push(data); 
        this.sortedList = this.sortedList.sort((a, b) => a.dateTime - b.dateTime )
         .slice(Math.max(this.sortedList.length - 20, 0))
         .sort((a, b) => a.dateTime - b.dateTime );
        
         const sum = this.sortedList.map((item: {used: number})=>{return item.used;}).reduce((a, b) => a + b, 0);
        
         this.avg = Math.round((sum / this.sortedList.length));
         this.used = Math.round(data.used);

         if(this.used > 50 && this.used < 70){
           this.status = "warning"
         }
         else if(this.used > 70){
           this.status  ="danger"
         }
         else{
           this.status = "success"
         }

      })
    )
  }

}