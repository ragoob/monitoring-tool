import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Events } from '../../core/models/events';
import { LoaderService } from '../../core/services/loader.service';
import { SocketService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-run-image',
  templateUrl: './run-image.component.html',
  styleUrls: ['./run-image.component.scss']
})
export class RunImageComponent implements OnInit {
  form: FormGroup;
  public formSubmitted: boolean;
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private loader: LoaderService,
  private snackBar: MatSnackBar,
  private socket: SocketService,
  private dialogRef:MatDialogRef<RunImageComponent>, 
  
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      image: ['',Validators.required],
      name: [''],
      args: ['']
    })
  }

  public run(){
    this.formSubmitted  = true;
    if(this.form.invalid){
     this.form.controls["image"].markAsTouched();
     this.form.controls["name"].markAsTouched();
     this.form.controls["args"].markAsTouched();
      return;
    }

    const event: string = `ui-${this.data.daemonId}-${Events.DOCKER_RUN_IMAGE}`
    this.socket.emit(event,this.form.value);
    this.dialogRef.close({
      result:true
    });

  }

  public close(){
    this.dialogRef.close({
      result:false
    });
  }

}
