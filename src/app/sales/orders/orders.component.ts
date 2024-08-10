import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../product.service';
import { SidebarComponent } from '../../dash/sidebar/sidebar.component';
import { ConfirmModalComponent } from '../../dash/confirm-modal/confirm-modal.component';
import { CeilPipe } from '../../ceil.pipe';
import { BasketItem, BasketService } from '../../basket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent,SidebarComponent,CeilPipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  
  products: any[] = [];
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5; 
  totalProducts: number = 0;
  selectedProduct: any = [];
  productToDelete: any = null;
  message: string | null = null;
  viewBasketEnabled: boolean = false; 
  constructor(private productService: ProductService,
    private basketService: BasketService, 
    private router : Router
    ) {}

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
  }
  viewBasket(): void {
    this.router.navigate(['/basket']);
  }
  
  addToBasket(product: any, quantity: number): void {
    if (!quantity || quantity > product.quantity) {
      alert('Invalid quantity');
      return;
    }
    product.isAdded = true;
    this.viewBasketEnabled = true;  
    const item: BasketItem = {
      id: product.id,
      oldQuantity: product.quantity,
      name: product.name,
      category: product.category,
      quantity,
      price: product.price,
      total: quantity * product.price
    };
    this.basketService.addToBasket(item);
   
    console.log('Item added to basket:', item);
  

}


}

