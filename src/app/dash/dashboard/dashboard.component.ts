import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../../main/login/footer/footer.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  
  date = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}