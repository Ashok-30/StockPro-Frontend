// src/app/services/purchase.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../purchase.model';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:8080/purchase';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllPurchases(): Observable<Purchase[]> {
    const headers = this.getHeaders();
    return this.http.get<Purchase[]>(this.apiUrl, { headers });
  }

  getPurchaseById(id: number): Observable<Purchase> {
    const headers = this.getHeaders();
    return this.http.get<Purchase>(`${this.apiUrl}/${id}`, { headers });
  }

  addPurchase(purchase: any): Observable<Purchase> {
    const headers = this.getHeaders();
    return this.http.post<Purchase>(this.apiUrl, purchase, { headers });
  }

  updatePurchase(id: number, purchase: Purchase): Observable<Purchase> {
    const headers = this.getHeaders();
    return this.http.put<Purchase>(`${this.apiUrl}/${id}`, purchase, { headers });
  }

  deletePurchase(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
