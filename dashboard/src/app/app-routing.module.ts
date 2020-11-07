import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService  as AuthGuard} from './core/services/auth.guard.service';
import { DashComponent } from './dashboard/dash.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: '', component: HomeComponent,  canActivate: [AuthGuard]},
  {path: 'dashboard/:id', component: DashComponent, canActivate: [AuthGuard]},
  {path: 'login',component: LoginComponent},
  {path: 'management',loadChildren: () => import('../app/management/management.module').then(m => m.management) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
