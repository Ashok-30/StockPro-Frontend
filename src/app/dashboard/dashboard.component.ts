import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userDetails: any = {};
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.authService.getDashboard().subscribe({
      next: (response) => {
        this.userDetails = response;
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
}
