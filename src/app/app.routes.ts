import { Routes } from '@angular/router';
import { HomeComponent } from './main/login/home/home.component';
import { SignupComponent } from './main/login/signup/signup.component';
import { LoginComponent } from './main/login/login.component';
import { DashboardComponent } from './dash/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ManageUsersComponent } from './users/add-user/manage-users/manage-users.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ManageProductComponent } from './products/manage-product/manage-product.component';
import { OrdersComponent } from './sales/orders/orders.component';
import { BasketComponent } from './sales/orders/basket/basket.component';
import { ProfileComponent } from './users/profile/profile.component';
import { PurchaseComponent } from './purchases/purchase/purchase.component';
import { AddPurchaseComponent } from './purchases/add-purchase/add-purchase.component';



export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'signup', title: 'SignUp', component: SignupComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'dashboard', title: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-user', title: 'Add User', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'manage-users', title: 'Manage User', component: ManageUsersComponent, canActivate: [AuthGuard] },
  { path: 'add-product', title: 'Add Product', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'manage-product', title: 'Manage Products', component: ManageProductComponent, canActivate: [AuthGuard] },
  { path: 'orders', title: 'Orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'basket', title: 'Basket', component: BasketComponent, canActivate: [AuthGuard] },

  { path: 'profile', title: 'Profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'purchase', title: 'Purchase', component: PurchaseComponent, canActivate: [AuthGuard] },
  { path: 'add-purchase', title: 'Add Purchase', component: AddPurchaseComponent, canActivate: [AuthGuard] },

 
];
