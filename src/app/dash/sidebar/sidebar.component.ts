import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit {
  message: string = '';
  userDetails: any = {};
  isUserDropdownOpen = false;
  isProductDropdownOpen = false;
  isSalesDropdownOpen = false;
  isPurchaseDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute();
      }
    });
    this.checkCurrentRoute(); // Initial check
  }

  fetchUserDetails(): void {
    this.authService.getDashboard().subscribe({
      next: (response) => {
        this.userDetails = response;
        // console.log('User details:', this.userDetails); // Log the user details for debugging
      },
      error: (error) => {
        this.message = 'Error fetching dashboard details';
        console.error('Error fetching dashboard details', error);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.message = 'Error logging out';
        console.error('Error logging out', error);
      }
    });
  }

  toggleDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  toggleDropdownProduct() {
    this.isProductDropdownOpen = !this.isProductDropdownOpen;
  }

  toggleDropdownSales() {
    this.isSalesDropdownOpen = !this.isSalesDropdownOpen;
  }
  toggleDropdownPurchase() {
    this.isPurchaseDropdownOpen = !this.isPurchaseDropdownOpen;
  }


  checkCurrentRoute() {
    const currentRoute = this.router.url;
    this.isProductDropdownOpen = currentRoute === '/add-product' || currentRoute === '/manage-product';
    this.isUserDropdownOpen = currentRoute === '/add-user' || currentRoute === '/manage-users';
    this.isSalesDropdownOpen = currentRoute === '/orders' || currentRoute === '/basket';
    this.isPurchaseDropdownOpen = currentRoute === '/purchase' || currentRoute === '/add-purchase';
  }
}
