import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';  // Adjust path as necessary

import { SidebarComponent } from '../../dash/sidebar/sidebar.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [SidebarComponent,CommonModule,FormsModule],
  standalone: true
})
export class ProfileComponent implements OnInit {
  message: string | null = null;
  user: User = {
    id: 0,
    name: '',
    contactNumber: '',
    email: '',
    role: ''
  };
   

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe({
      next: (userData: User) => {
        this.user = userData;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }
  updateUser(): void {
    if (this.user.role === 'ADMIN') {
      this.authService.updateUser(this.user.id, this.user,).subscribe({
        next: (response) => {

          this.message= 'Profile updated successfully';
          setTimeout(() => {
            this.message = null;  // Clear message after 2 seconds
          }, 2000);
        },
        error: (err) => {
          console.error('Failed to update profile:', err);
          // Optionally handle errors, e.g., show an error message
        }
      });
    }
}
}