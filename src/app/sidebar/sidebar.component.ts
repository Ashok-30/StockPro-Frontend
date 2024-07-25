import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';

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
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.authService.getDashboard().subscribe({
      next: (response) => {
        this.userDetails = response;
        console.log('User details:', this.userDetails); // Log the user details for debugging
      },
      error: (error) => {
        this.message = 'Error fetching dashboard details';
        console.error('Error fetching dashboard details', error);
      }
    });
  }

  collapseClass: string = '';

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
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
