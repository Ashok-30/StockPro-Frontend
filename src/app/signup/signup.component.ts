import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: any = {
    name: '',
    contactNumber: '',
    email: '',
    password: '',
    storeName: '',
    storeAddress: ''
  };
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(signupForm: NgForm): void {
    if (signupForm.valid) {
      this.authService.signUp(this.user).subscribe({
        next: (response) => {
          this.message = response;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
          this.resetForm(signupForm);
        },
        error: (error) => {
          this.message = error.error;
        }
      });
    } else {
      this.message = 'Please fix the errors in the form before submitting.';
    }
  }

  resetForm(signupForm: NgForm): void {
    signupForm.resetForm();
    this.user = {
      name: '',
      contactNumber: '',
      email: '',
      password: '',
      storeName: '',
      storeAddress: ''
    };
  }
}
