import { Summary } from '@angular/compiler';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Machine } from '../../core/models/machine.model';
import { SocketService } from '../../core/services/socket-io.service';
export interface MachineSummary{
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
  public data: MachineSummary;
  public memoryStatus: string = "success";
  public cpuStatus: string = "success";
  public diskStatus: string ="success";
  public title: string;
  constructor( private socketService: SocketService,
    private spinner: NgxSpinnerService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.title = this.machine.name;
    this.matIconRegistry.addSvgIcon(
      "ram-memory",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/ram-memory.svg")
    );
    this.spinner.show('SummaryCardComponent-' + this.machine.id);
    this.spinnerHideTimeout();
    this.subscribers.push(
      this.socketService.getSummary(this.machine.id)
        .subscribe((res: MachineSummary)=> {
         this.data = res;
          this.spinner.hide('SummaryCardComponent-'  + this.machine.id);
          this.setCpuStatus(res);
          this.setDiskStatus(res);
          this.setMemoryStatus(res);
          this.loaded = true;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(s=> s.unsubscribe());
  }

  public goToDetails(){
    this.router.navigate(['dashboard',this.machine.id])

  }
  private setCpuStatus(data: MachineSummary): void{
    if (data.cpu > 50 && data.cpu <= 70) {
      this.cpuStatus = "warning"
    }
    else if (data.cpu > 70) {
      this.cpuStatus = "danger"
    }
    else {
      this.cpuStatus = "success"
    }
  }

  private setMemoryStatus(data: MachineSummary): void {
    if (data.memory > 50 && data.memory <= 70) {
      this.memoryStatus = "warning"
    }
    else if (data.memory > 70) {
      this.memoryStatus = "danger"
    }
    else {
      this.memoryStatus = "success"
    }
  }

  private setDiskStatus(data: MachineSummary): void {
    if (data.disk > 50 && data.disk <= 70) {
      this.diskStatus = "warning"
    }
    else if (data.disk > 70) {
      this.diskStatus = "danger"
    }
    else {
      this.diskStatus = "success"
    }
  }

  private spinnerHideTimeout(){
    setTimeout(() => {
      this.spinner.hide('SummaryCardComponent-' + this.machine.id);
    }, 20 * 1000);
  }


}
