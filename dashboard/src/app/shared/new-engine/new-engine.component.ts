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
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-engine',
  templateUrl: './new-engine.component.html',
  styleUrls: ['./new-engine.component.scss']
})
export class NewEngineComponent implements OnInit {
   menu: any;
   machineForm: FormGroup;
  public formSubmitted: boolean;
  @ViewChild("commandelement", {read: ElementRef}) commandText: ElementRef;
  durationInSeconds: number;

  constructor(
    private menuService: MenuService,
    private machineService: MachineService,  
    private dialogRef:MatDialogRef<NewEngineComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
   
    this.machineForm = this.fb.group({
      id: this.data && this.data.id ? [this.data.id]: [],
      name:this.data && this.data.name ? [this.data.name,Validators.required] : ['',Validators.required]
    });
  
  }

  public addNew(){
    this.formSubmitted  = true;
    if(this.machineForm.invalid){
     this.machineForm.controls["name"].markAsTouched();
      return;
    }

    this.spinner.show('NewEngineComponent');
    this.machineService.saveMachine(this.machineForm.value)
    .then(d=> {
      const menu = this.menuService.menuItems$.value;
      if(this.data && this.data.actiontype === 'edit'){
        menu[1].children.find(c=> c.id == d.id).displayName = d.name;
      }
     else{
      menu[1].children.push({
        displayName:d.name,
        route: `/dashboard/${d.id.toString()}`,
        iconName : ''
      });
     }
      this.menuService.menuItems$.next(menu);
      this.spinner.hide('NewEngineComponent');
      this.dialogRef.close({
        result: true,
        data: d
      });
    }).catch(reason=> {
      this.spinner.hide('NewEngineComponent');
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
