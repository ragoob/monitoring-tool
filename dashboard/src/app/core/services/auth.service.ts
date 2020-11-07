import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { API_BASE_URL } from '../constant';
import { LoginModel } from '../models/login.model';
import { TokenModel } from '../models/token.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, 
    private router: Router,
    @Inject(API_BASE_URL) private baseUrl?: string,
    ) { }

  public login(model: LoginModel): Observable<TokenModel>{
    return this.http.post<TokenModel>(`${this.baseUrl}/auth/token`, model)
    .pipe(tap(
       (result: TokenModel)=> {
         this.setSession(result);
       }
    )).pipe(shareReplay())
    
  }

  public isAuthenticated(): boolean{
    const jwtHelper = new JwtHelperService();
    const token: string = localStorage.getItem('id_token');
    if(token && !jwtHelper.isTokenExpired(token)){
      // this.isLoggedIn$.next(true);
      // alert('authenticated')
      return true;
    }
    else{
     this.logOut();
      return false;
    }

  }

  public getUser(): User{
    const jwtHelper = new JwtHelperService();
    const token: string = localStorage.getItem('id_token');
    if(token && !jwtHelper.isTokenExpired(token)){
      return jwtHelper.decodeToken(token) as User;
    }

    return undefined;
    
  }
  public logOut(){
    localStorage.removeItem('id_token');
    this.isLoggedIn$.next(false);
    this.router.navigate(['login'])
  }

  private setSession(tokenResult: TokenModel){
    localStorage.setItem('id_token',tokenResult.accessToken);
    this.isLoggedIn$.next(true);
    this.router.navigate(['/'])
  }

  public getToken(): string{
    const token: string = localStorage.getItem('id_token');
    return token;
  }

}
