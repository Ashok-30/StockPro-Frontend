import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../../main/login/footer/footer.component";
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FooterComponent,CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  

  userCount: number = 0; 
  growthData: { growthPercentage: number, trend: string } | null = null;
  salesData: { growthPercentage: number, trend: string, totalSalesToday: number } | null = null;
  topSellingProducts: any[] = [];
  belowMinimumProducts: any[] = [];
  constructor(private authService: AuthService, private productService: ProductService) { } 

  ngOnInit() {
    this.loadUserCount();
    this.loadGrowthData();
    this.loadSalesData();
    this.loadTopSellingProducts();
    this.loadBelowMinimumProducts();
  }

  loadUserCount() {
    this.authService.getUsersCountByStore().subscribe({
      next: (count) => {
        this.userCount = count; // Assign the fetched count to the property
      },
      error: (error) => {
        console.error('Error fetching user count', error);
      }
    });
  }

  loadGrowthData() {
    this.authService.getUsersGrowthByStore().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          console.log(data);
          this.growthData = {
          
            
            growthPercentage: data[0].growthPercentage,

            trend: data[0].trend
        
         
          };
        } else {
          this.growthData = null;
        }
      },
      error: (error) => {
        console.error('Error fetching user growth data', error);
        this.growthData = null;
      }
    });
  }
  loadSalesData() {
    this.productService.getDailySalesData().subscribe({
      next: (data) => {
        console.log(data);
        this.salesData = {
          growthPercentage: data.percentageDifference,
          trend: data.trend,
          totalSalesToday: data.totalSalesToday
        };
      },
      error: (err) => console.error('Failed to fetch sales data:', err)
    });
  }
  loadTopSellingProducts() {
    this.productService.getTopSellingProducts().subscribe({
      next: (products) => {
        this.topSellingProducts = products;
        console.log('Top Selling Products:', this.topSellingProducts);
      },
      error: (error) => {
        console.error('Error fetching top-selling products:', error);
      }
    });
  }
  loadBelowMinimumProducts() {
    this.productService.getProductsBelowMinimum().subscribe({
      next: (products) => {
        this.belowMinimumProducts = products;
        console.log('Below Minimum Products:', this.belowMinimumProducts);
      },
      error: (error) => {
        console.error('Error fetching below minimum products:', error);
      }
    });
  }
  getPercentageColor(percentage: number): string {
    if (percentage >= 20) {
      return '#4CAF50'; // Green for 75% and above
    } else if (percentage >= 10) {
      return '#FFC107'; // Yellow for 50% and above
    } else {
      return '#F44336'; // Red for below 50%
    }
  }

  getContainerColor(percentage: number): string {
    if (percentage >= 20) {
      return '#C8E6C9'; // Light green for 75% and above
    } else if (percentage >= 10) {
      return '#FFECB3'; // Light yellow for 50% and above
    } else {
      return '#FFCDD2'; // Light red for below 50%
    }
  }
}