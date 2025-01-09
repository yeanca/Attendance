import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-gaurd.service';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './services/auth.guard';
import { TodayComponent } from './attendance/today/today.component';
import { MonthComponent } from './attendance/month/month.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'today', component: TodayComponent, canActivate: [authGuard] },
  { path: 'month', component: MonthComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
