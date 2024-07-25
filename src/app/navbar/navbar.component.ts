import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [RouterLink,RouterLinkActive],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

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

}
