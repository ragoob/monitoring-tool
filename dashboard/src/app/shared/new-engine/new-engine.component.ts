import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuService } from '../../core/services/menu.service';
import { Guid } from "guid-typescript";
import { environment } from '../../../environments/environment';
import { MachineService } from '../../core/services/machine.service';
import { Machine } from '../../core/models/machine.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../core/services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-new-engine',
  templateUrl: './new-engine.component.html',
  styleUrls: ['./new-engine.component.scss']
})
export class NewEngineComponent implements OnInit {
   machineForm: FormGroup;
  public command: string;
  public formSubmitted: boolean;
  @ViewChild("commandelement", {read: ElementRef}) commandText: ElementRef;
  durationInSeconds: number;

  constructor(
    private menuService: MenuService,
    private machineService: MachineService,  
    private dialogRef:MatDialogRef<NewEngineComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private loader: LoaderService,
    private snackBar: MatSnackBar
    
    ) { }

  ngOnInit(): void {
    this.machineForm = this.fb.group({
      id: [Guid.create().toString()],
      name:['',Validators.required]
    });
   const deploymentFile: string = `${environment.gateWay}/machine/deployment/${this.machineForm.controls['id'].value}`
    this.command = `curl ${ deploymentFile} | sh`
  }

  public addNew(){
    this.formSubmitted  = true;
    if(this.machineForm.invalid){
     this.machineForm.controls["name"].markAsTouched();
      return;
    }

    this.loader.loading$.next(true);
    this.machineService.saveMachine(this.machineForm.value)
    .then(d=> {
      const menu = this.menuService.menuItems$.value;
      menu.push({
        title:this.machineForm.controls["name"].value,
        route: `/${this.machineForm.controls["id"].value}`
      });
      this.menuService.menuItems$.next(menu);
      this.loader.loading$.next(false);
      this.dialogRef.close({
        result: true
      });
    }).catch(reason=> {
      this.loader.loading$.next(false);
      this.snackBar.openFromComponent(NotificationComponent, {
        duration: this.durationInSeconds * 1000,
        data: {
          type: 'error',
          message: `Error during save machine ${reason}`
        }
      });
    })
    

  
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
