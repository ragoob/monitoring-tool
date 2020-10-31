import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DockerEngineService } from '../../core/services/docker-engine.service';
import { MenuService } from '../../core/services/menu.service';
import { ServerService } from '../../core/services/server.service';
import { Guid } from "guid-typescript";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-new-engine',
  templateUrl: './new-engine.component.html',
  styleUrls: ['./new-engine.component.scss']
})
export class NewEngineComponent implements OnInit {
  model: string;
  host: string;
  deploymentFile: string;
  command: string;
  @ViewChild("commandelement", {read: ElementRef}) commandText: ElementRef;

  constructor(private serverService: ServerService,
    private menuService: MenuService,  private dialogRef:MatDialogRef<NewEngineComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,private elRef:ElementRef) { }

  ngOnInit(): void {
    this.host = this.data.GUID;
    console.log(this.host)
    this.deploymentFile = `${environment.gateWay}/deployment/${this.host}`
    this.command = `curl ${ this.deploymentFile} | sh`
  }

  public addNew(){
    if(!this.model){
      return;
    }
    this.serverService.create({
      name: this.model,
      host:this.host
    });
    const menu = this.menuService.menuItems$.value;
    menu.push({
      title:this.model,
      route: `/${this.host}`
    });

    this.menuService.menuItems$.next(menu);
    this.dialogRef.close({
      result: true
    });
  }

  public close(){
    this.dialogRef.close({
      result:false
    });
  }

  public copy(){
    const  copyText = this.commandText.nativeElement;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }
}
