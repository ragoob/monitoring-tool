import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-temp-card',
  templateUrl: './temp-card.component.html',
  styleUrls: ['./temp-card.component.scss']
})
export class TempCardComponent implements OnInit {
  private subscribers: Subscription[] = [];
  private sortedList: any[] = [];
  @Input('daemonId') daemonId: string;
  public temperature: number;
  public avg: number;
  public usagePerc: number;
  public status: string = "success";
  constructor( private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private socketService: SocketService
    ) { }

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      "thermometer",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/mdi-thermometer.svg")
    );

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
        
         const sum = this.sortedList.map((item: {temperature: number})=>{return item.temperature;}).reduce((a, b) => a + b, 0);
        
         this.avg = Math.round((sum / this.sortedList.length));
         this.temperature = Math.round(data.temperature);

         if(this.temperature > 50 && this.temperature < 60){
           this.status = "warning"
         }
         else if(this.temperature > 60){
           this.status  ="danger"
         }
         else{
           this.status = "success"
         }

      })
    )
  }

}
