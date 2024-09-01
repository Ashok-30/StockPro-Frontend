import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../../main/login/footer/footer.component";
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../product.service';
import { Chart, ChartConfiguration } from 'chart.js';

const fixedColors = [
  'rgba(255, 99, 132, 0.6)',  // Red
  'rgba(54, 162, 235, 0.6)',  // Blue
  'rgba(255, 205, 86, 0.6)',  // Yellow
  'rgba(75, 192, 192, 0.6)',  // Teal
  'rgba(153, 102, 255, 0.6)'  // Purple
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  userCount: number = 0; 
  growthData: { growthPercentage: number, trend: string } | null = null;
  salesData: { growthPercentage: number, trend: string, totalSalesToday: number } | null = null;
  topSellingProducts: any[] = [];
  belowMinimumProducts: any[] = [];
  
  // Separate chart instances
  bubbleChart: any;
  doughnutChart: any;
  barChart: any;
  
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
        this.userCount = count;
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
  
        const labels = this.topSellingProducts.map(product => product.productName);
        const data = this.topSellingProducts.map(product => product.percentageOfTotalSales);
        const backgroundColors = this.topSellingProducts.map((_, index) => fixedColors[index % fixedColors.length]);
  
        this.updateDoughnutChart(labels, data, backgroundColors);
      },
      error: (error) => {
        console.error('Error fetching top-selling products:', error);
      }
    });
  }
  
  updateDoughnutChart(labels: string[], data: number[], backgroundColors: string[]): void {
    const canvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      if (this.doughnutChart) {
        this.doughnutChart.destroy();
      }
  
      this.doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Top Selling Products',
            data: data,
            backgroundColor: backgroundColors,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
          }
        }
      });
    } else {
      console.error('Failed to get 2D context for canvas');
    }
  }

  loadBelowMinimumProducts() {
    this.productService.getProductsBelowMinimum().subscribe({
      next: (products) => {
        this.belowMinimumProducts = products;
        console.log('Below Minimum Products:', this.belowMinimumProducts);
  
        const labels = this.belowMinimumProducts.map(product => product.name);
        const data = this.belowMinimumProducts.map(product => product.quantity);
  
        this.updateBarChart(labels, data);
      },
      error: (error) => {
        console.error('Error fetching below minimum products:', error);
      }
    });
  }
  
  updateBarChart(labels: string[], data: number[]): void {
    const canvas = document.getElementById('belowMinimumChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      if (this.barChart) {
        this.barChart.destroy();
      }
  
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Available Quantity',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              reverse: true
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
          }
        }
      });
    } else {
      console.error('Failed to get 2D context for canvas');
    }
  }

  getPercentageColor(percentage: number): string {
    if (percentage >= 20) {
      return '#4CAF50';
    } else if (percentage >= 10) {
      return '#FFC107';
    } else {
      return '#F44336';
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