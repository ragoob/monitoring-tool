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

  public subscribers: Subscription[] = [];
  public logs: string;
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
    this.subscribers.push(
      this.socketService.getContainerlogs(this.data.daemonId)
        .subscribe((result: any) => {
          if (result.containerId == this.data.containerId) {
            this.spinner.hide('ContainerDetailsComponent');
            this.logs = result.logs;
            const html = this.logs.replace(/\n/g, '<br/>');
            this.logsElement.nativeElement.innerHTML = html;

          }



        })
    );

  }

  ngOnInit(): void {
    this.socketService.emit(`ui-${this.data.daemonId}-${Events.ASK_CONTAINER_LOGS}`, this.data.containerId);
    

  }

  public close(){
    this.dialogRef.close({
    });
  }

}
