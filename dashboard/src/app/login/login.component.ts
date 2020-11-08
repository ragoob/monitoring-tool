import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public formSubmitted: boolean;
  public loginError: boolean;
  public loading: boolean;
  constructor(private fb: FormBuilder,
              private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
      
    })
  }

  public login(){
    this.formSubmitted  = true;
    if(this.form.invalid){
     this.form.controls["email"].markAsTouched();
     this.form.controls["password"].markAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.form.value)
    .toPromise()
    .then(d=>{
        this.loading = false;
    },error=> {
      this.loading =false;
      this.loginError = true;
    })

  }

}
