import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { interval, Subscription, switchMap, catchError, of, filter } from 'rxjs';
import { BasketItem, BasketService } from '../../../basket.service';
import { ProductService } from '../../../product.service';
import { SidebarComponent } from '../../../dash/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,RouterModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {
  basketItems: BasketItem[] = [];
  grossAmount: number = 0;
  currentDate: string = '';
  currentTime: string = '';
  message: string | null = null;
  customerName: string = '';
  customerPhone: string = '';
  private timeSubscription!: Subscription;



  constructor(private basketService: BasketService, private productService: ProductService, private router: Router) {
  
  }

  ngOnInit() {
    this.updateDateTime();
    this.timeSubscription = interval(60000).subscribe(() => {
      this.updateDateTime();
    });
    this.basketService.basket$.subscribe((items) => {
      this.basketItems = items;
      this.updateGrossAmount();
    });
    
   
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  private updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    this.currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  calculateAmount(item: any): void {
    if (item.quantity > item.oldQuantity) {
      alert('Insufficient Quantity');
      item.quantity = item.oldQuantity;
      return;
    }
    const quantity = parseInt(item.quantity);
    if (!isNaN(quantity) && quantity > 0) {
      item.total = quantity * parseFloat(item.price);
    } else {
      item.total = 0;
    }
    this.updateGrossAmount();
  }

  updateGrossAmount(): void {
    this.grossAmount = this.basketItems.reduce((sum, item) => sum + item.total, 0);
  }

  removeItem(item: BasketItem): void {
    this.basketItems = this.basketItems.filter(basketItem => basketItem !== item);
    this.updateGrossAmount();
  }

  placeOrder() {
    if (!this.customerName || !this.customerPhone || this.basketItems.some(item => item.quantity <= 0)) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    const saleRequests = this.basketItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    this.productService.sellProducts(saleRequests).pipe(
      switchMap(() => {
        const productIds = this.basketItems.map(item => item.id).join(',');
        const orderData = {
          customerName: this.customerName,
          customerNumber: this.customerPhone,
          productIds,
          totalAmount: this.grossAmount
        };
        return this.productService.addOrder(orderData);
      }),
      catchError(error => {
        console.error('Error during transaction:', error);
        return of('Failed to complete transaction');
      })
    ).subscribe({
      next: () => {
        console.log('Transaction completed successfully');
        this.message = 'Transaction completed successfully!';
        this.resetBasket();
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000);
       
      },
      error: error => console.error('Final error handling:', error)
    });
  }
  private resetBasket() {
    this.basketItems = [];  
    this.updateGrossAmount();  

    this.customerName = '';
    this.customerPhone = '';
}

}
