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
getDailySalesData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl1}/orders/sales-data`, { headers: this.getHeaders() });
}
getTopSellingProducts(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl1}/orders/top-selling-products`, { headers: this.getHeaders() });
}
getProductsBelowMinimum(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/below-minimum`, { headers: this.getHeaders() });
}

uploadProductFile(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  const headers = this.getHeaders(); // Ensure headers are correctly set
  return this.http.post(`${this.apiUrl}/upload`, formData, {
    headers: headers,
    responseType: 'text'  // Make sure this matches what the server sends back
  });
}

searchProducts(name: string): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${this.apiUrl}/search`, { headers: headers, params: new HttpParams().set('name', name) });
}
  


getAllPurchases(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl1}/purchase/${id}`, { headers: this.getHeaders() });
}



updatePurchase(id: number, product: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/purchase/${id}`, product, { headers: this.getHeaders(), responseType: 'text' });
}


deletePurchase(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/purchase/${id}`, { headers: this.getHeaders(), responseType: 'text' });
}
}
