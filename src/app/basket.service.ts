import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BasketItem {
  id: number;
  name: string;
  category: string;
  oldQuantity: number;
  quantity: number;
  price: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketSubject = new BehaviorSubject<BasketItem[]>([]);
  basket$ = this.basketSubject.asObservable();
  basketItems: BasketItem[] = [];
  constructor() { }

  addToBasket(item: BasketItem): void {
    // Create a new array with the new item added, ensuring immutability
    const currentItems = this.basketSubject.value;
    this.basketSubject.next([...currentItems, item]);
  }

  clearBasket(): void {
    // Clear all items by setting a new empty array
    this.basketSubject.next([]);
  }

  getBasket(): BasketItem[] {
    // Return the current snapshot of the basket items
    return this.basketSubject.value;
  }
}
