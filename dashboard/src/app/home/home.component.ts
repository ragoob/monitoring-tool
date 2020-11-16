import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Machine } from '../core/models/machine.model';
import { MachineService } from '../core/services/machine.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public list: Machine[];
  constructor(private machineService: MachineService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.machineService.getMachines()
    .then(d=> {
      this.list = d;
      this.spinner.hide();
    })
  }

}
