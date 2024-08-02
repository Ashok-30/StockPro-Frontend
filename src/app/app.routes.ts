import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';


export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'signup', title: 'SignUp', component: SignupComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'dashboard', title: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-user', title: 'Add User', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'manage-users', title: 'Manage User', component: ManageUsersComponent, canActivate: [AuthGuard] },
 
];
