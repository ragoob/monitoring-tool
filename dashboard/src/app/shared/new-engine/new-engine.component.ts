import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DockerEngineService } from '../../core/services/docker-engine.service';
import { MenuService } from '../../core/services/menu.service';
import { ServerService } from '../../core/services/server.service';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-new-engine',
  templateUrl: './new-engine.component.html',
  styleUrls: ['./new-engine.component.scss']
})
export class NewEngineComponent implements OnInit {
  model: string;
  constructor(private serverService: ServerService,private engineService: DockerEngineService,private menuService: MenuService,  private dialogRef:MatDialogRef<NewEngineComponent>) { }

  ngOnInit(): void {
  }

  public addNew(){
    if(!this.model){
      return;
    }
   
    const hostGuid =  Guid.create().toString();
    this.serverService.create({
      name: this.model,
      host:hostGuid
    });
    const menu = this.menuService.menuItems$.value;
    menu.push({
      title:this.model,
      route: `/${hostGuid}`
    });
  }

  public close(){
    this.dialogRef.close();
  }
}
