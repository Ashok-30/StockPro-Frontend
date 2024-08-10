import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../order.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/products';
  private apiUrl1 = 'http://localhost:8080';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllProducts(page: number, pageSize: number): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    return this.http.get(`${this.apiUrl}`, { headers, params });
  }
  
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json'  // Treat the response as text
    });
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders(), responseType: 'text' });
  }
  

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }
  // ProductService
sellProducts(saleRequests: any[]): Observable<string> {
  const headers = this.getHeaders();
  return this.http.put<string>(`${this.apiUrl}/sell-products`, saleRequests, {
      headers: headers,
      responseType: 'text' as 'json'  
  });
}

addOrder(orderData: Order): Observable<Order> {
  return this.http.post<Order>(`${this.apiUrl1}/orders`, orderData, { headers: this.getHeaders() });
}
  
}
