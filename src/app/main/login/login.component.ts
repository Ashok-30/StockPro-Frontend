import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: any = {
    email: '',
    password: ''
  };
  otp: string = '';
  otpSent: boolean = false;
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm): void {
    if (!this.otpSent) {
      this.authService.verifyCredentials(this.credentials).subscribe({
        next: (response) => {
          this.authService.generateOtp(this.credentials.email).subscribe({
            next: (response) => {
              this.message = response;
              this.otpSent = true;
            },
            error: (error) => {
              this.message = error.error;
            }
          });
        },
        error: (error) => {
          this.message = 'Invalid credentials';
        }
      });
    } else {
      this.authService.verifyOtp(this.credentials.email, this.otp).subscribe({
        next: (response) => {
          this.message = response;
          // Store the token after OTP verification
          this.authService.login(this.credentials).subscribe({
            next: (token) => {
              this.authService.storeToken(token);
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.message = error.error;
            }
          });
        },
        error: (error) => {
          this.message = error.error;
        }
      });
    }
  }
}
