import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { timer } from 'rxjs';
import { ConfirmModalComponent } from '../dash/confirm-modal/confirm-modal.component';
import { SidebarComponent } from '../dash/sidebar/sidebar.component';
import { CeilPipe } from '../ceil.pipe';
import { ProductService } from '../product.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const fixedColors = [
  'rgba(255, 99, 132, 0.6)',  // Red
  'rgba(54, 162, 235, 0.6)',  // Blue
  'rgba(255, 205, 86, 0.6)',  // Yellow
  'rgba(75, 192, 192, 0.6)',  // Teal
  'rgba(153, 102, 255, 0.6)', // Purple
  'rgba(255, 159, 64, 0.6)',  // Orange
  'rgba(199, 199, 199, 0.6)'  // Grey
];

interface ForecastData {
  date: string;
  quantity: number;
}
@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent, SidebarComponent, CeilPipe],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  products: any[] = [];
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalProducts: number = 0;
  selectedProduct: any = null;

  message: string | null = null;
  searchValue: string = '';
  forecastData: ForecastData[] = [];
  Object: any;
  chart: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts(this.currentPage - 1, this.pageSize).subscribe({
      next: (data: any) => {
        this.products = data.content;
        this.totalProducts = data.totalElements;
        this.setPage(this.currentPage);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalProducts) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.fetchProducts();
  }

  selectProduct(product: any): void {
    this.selectedProduct = { ...product };
    this.getForecast();
  }

  getForecast(): void {
    if (this.selectedProduct) {
      this.productService.getSalesForecast(this.selectedProduct.id).subscribe({
        next: (data) => {
          if (data && typeof data === 'object') {
            this.forecastData = Object.entries(data).map(([key, value]) => ({
              date: key,
              quantity: value as number // Explicitly typing value as number
            }));
          } else {
            console.error('Invalid data format:', data);
          }
  
          this.updateChart(); // Update the chart with the new data
        },
        error: (error) => {
          console.error('Error fetching forecast:', error);
        }
      });
    }
  }

  updateChart(): void {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      // Use fixed colors instead of random colors
      const backgroundColors = this.forecastData.map((_, index) => fixedColors[index % fixedColors.length]);
      const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.forecastData.map((item: ForecastData) => new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })),
          datasets: [{
            label: 'Forecasted Sales Quantity',
            data: this.forecastData.map((item: ForecastData) => item.quantity),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('Failed to get 2D context for canvas');
    }
  }
  
  

  searchProducts(): void {
    if (this.searchValue) {
      this.productService.searchProducts(this.searchValue).subscribe({
        next: (data) => {
          this.products = data;
          this.totalProducts = this.products.length;
          this.setPage(1); // Reset to first page of search results
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.fetchProducts(); // fetch all products if search is cleared
    }
  }
}
