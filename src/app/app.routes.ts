import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', title: 'Home', component: HomeComponent },
    { path: 'signup', title: 'SignUp', component: SignupComponent },
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'dashboard', title: 'Dashboard', component: DashboardComponent }
];
