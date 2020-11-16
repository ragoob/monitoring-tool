import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Machine } from '../../core/models/machine.model';
import { SocketService } from '../../core/services/socket-io.service';
export interface summary{
  cpu: number,
  memory: number,
  disk: number,
  dateTime: any
}
@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss']
})
export class SummaryCardComponent implements OnInit , OnDestroy {
  @Input('machine') machine: Machine;
  public loaded: boolean = false;
  private subscribers: Subscription[] = [];
  public data: summary;
  constructor( private socketService: SocketService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show('DiskCardComponent-' + this.machine.id);
    this.subscribers.push(
      this.socketService.getSummary(this.machine.id)
      .subscribe((res: summary)=> {
        this.data = res;

        this.spinner.hide('DiskCardComponent-'  + this.machine.id);
        this.loaded = true;
       
      })
    )
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

}
