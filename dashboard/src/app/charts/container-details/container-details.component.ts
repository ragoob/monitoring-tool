import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Events } from '../../core/models/events';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-container-details',
  templateUrl: './container-details.component.html',
  styleUrls: ['./container-details.component.scss']
})
export class ContainerDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild("logs") logsElement: ElementRef;
  public logsArgs: string = '--tail=100'
  public subscribers: Subscription[] = [];
  public logs: string;
  public lastRows: number = 0;
  public lastTime: number = 0;
  public showErrorOnly: boolean;
  constructor(
    private dialogRef: MatDialogRef<ContainerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socketService: SocketService,
    private spinner: NgxSpinnerService


  ) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

  ngAfterViewInit() {

    this.spinner.show('ContainerDetailsComponent');
    this.hideSpinnerTimeOut();
    this.subscribers.push(
      this.socketService.getContainerlogs(this.data.daemonId)
        .subscribe((result: any) => {
          console.log(result)
          if (result.containerId == this.data.containerId) {
           
            this.logs = result.logs;
            const html =  '<pre class="code-container"><code>' + this.logs.replace(/\n/g, '<br/>') + '</code></pre>';
            this.logsElement.nativeElement.innerHTML = html;

          }

          else{
            this.logs = '';
          }
          this.spinner.hide('ContainerDetailsComponent');

        })
    );

  }

  ngOnInit(): void {
    this.socketService.emit(`ui-${this.data.daemonId}-${Events.ASK_CONTAINER_LOGS}`,{
      containerId: this.data.containerId,
      args: this.logsArgs
    });
    

  }

  public filter(){
    let args: string = "";
    if(this.lastRows && this.lastRows > 0){
     
      args = `${args} --tail=${this.lastRows} `;
    }
    if(this.lastTime && this.lastTime > 0){
      args = `${args} --since=${this.lastTime}m `;
    }

    if(this.showErrorOnly){
      args = !this.lastRows || this.lastRows === 0 ?  `${args} --tail=100 1>/dev/null ` : `${args}  1>/dev/null `;
    }

    console.log('args' , args);
    this.socketService.emit(`ui-${this.data.daemonId}-${Events.ASK_CONTAINER_LOGS}`,{
      containerId: this.data.containerId,
      args: args.length > 0 ? args: this.logsArgs
    });

    this.spinner.show('ContainerDetailsComponent');
    this.hideSpinnerTimeOut();
  }

  public close(){
    this.dialogRef.close({
    });
  }

  private hideSpinnerTimeOut(){
    setTimeout(()=> {
       this.spinner.hide('ContainerDetailsComponent');
    },30 * 1000)
  }

}
