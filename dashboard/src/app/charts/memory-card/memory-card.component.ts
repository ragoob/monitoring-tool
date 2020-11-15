import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-memory-card',
  templateUrl: './memory-card.component.html',
  styleUrls: ['./memory-card.component.scss']
})
export class MemoryCardComponent implements OnInit, OnDestroy {
  private subscribers: Subscription[] = [];
  private sortedList: any[] = [];
  @Input('daemonId') daemonId: string;
  public usage: number;
  public avg: number;
  public usagePerc: number;
  public status: string = "success";
  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private socketService: SocketService
    
    ) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      "ram-memory",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/ram-memory.svg")
    );

    this.subscribers.push(
      this.socketService.getDeamonMemoryUsage(this.daemonId)
      .subscribe((data: {total:number,used:number,free:number,dateTime:any})=> {
         const date = new Date(data.dateTime);
         data.dateTime = date;
          this.sortedList.push(data);
         this.sortedList = this.sortedList.sort((a, b) => a.dateTime - b.dateTime )
         .slice(Math.max(this.sortedList.length - 20, 0))
         .sort((a, b) => a.dateTime - b.dateTime );
         const sum = this.sortedList.map((item: {used: number})=>{return item.used;}).reduce((a, b) => a + b, 0);
        
         this.avg = Math.round((((sum / this.sortedList.length)) / data.total) * 100)
         this.usage = data.used;
         this.usagePerc = Math.round((data.used / data.total) * 100)
         if(this.usagePerc  > 60 && this.usagePerc < 90){
           this.status = "warning";
         }

         else if(this.usagePerc >=90){
          this.status = "danger";
         }
         else{
          this.status= "success"
         }
       
      })
    )
  }

}
