import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user = {
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    role: 'EMPLOYEE' // Default role
  };

  message: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: any) {
    if (form.valid) {
      this.authService.addUser(this.user).subscribe(
        response => {
          console.log(response);
          this.message = response; // Set the message from the backend response
          if (response === 'User added successfully') {
            this.router.navigate(['/users/manage']); // Navigate to user management page
          }
        },
        error => {
          console.error(error);
          if (error.status === 400 && error.error === 'Email already exists') {
            this.message = 'Email already exists. Please use a different email.';
          } else if (error.status === 401 && error.error === 'Not authorized to create user') {
            this.message = 'Not authorized to create users. Please contact Admin.';
          } else {
            this.message = 'An error occurred. Please try again.';
          }
        }
      );
    }
  }
}
