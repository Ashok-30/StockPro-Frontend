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

  constructor() { }

  addToBasket(item: BasketItem): void {
    const currentItems = this.basketSubject.value;
    currentItems.push(item);
    this.basketSubject.next(currentItems);
  }

  getBasket(): BasketItem[] {
    return this.basketSubject.value;
  }
}
