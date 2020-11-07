import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../core/models/user.model';
import { LoaderService } from '../../../core/services/loader.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  public formSubmitted: boolean;
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private dialogRef:MatDialogRef<EditComponent>, 
  private userService: UserService
  
  ) { }


  ngOnInit(): void {
    
    let user: User = new User();
    if(this.data.user){
      user = this.data.user; 
    }
      this.form = this.fb.group({
        id: [user.id],
        email: [user.email,Validators.compose([Validators.required,Validators.email])],
        password: ['',Validators.required],
        isAdmin: [user.isAdmin]
      })
  }

  public save(){
    this.formSubmitted  = true;
    if(this.form.invalid){
     this.form.controls["email"].markAsTouched();
     this.form.controls["password"].markAsTouched();
     this.form.controls["isAdmin"].markAsTouched();
      return;
    }
    (this.form.controls["id"].value > 0 ? this.edit() : this.create())
    .then(d=> {
      this.dialogRef.close({
        result:true
      });
    })

  }

  private create(): Promise<User>{
    return this.userService.create(this.form.value);
  }

  private edit(): Promise<User>{
    return this.userService.update(this.form.value);
  }


  public close(){
    this.dialogRef.close({
      result:false
    });
  }

}
