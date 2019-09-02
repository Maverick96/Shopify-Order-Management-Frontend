import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants/app.contants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  getOrdersList(sort, offset, limit) {
    console.log("API ", BASE_URL)
    return this.http.get(`${BASE_URL}/order/list?sortby=${sort}&offset=${offset}&limit=${limit}`);
  }

  getOrderDetails(orderNumber) {
    return this.http.get(`${BASE_URL}/order/${orderNumber}`);
  }

  updateOrderDetails(payload) {
    return this.http.post(`${BASE_URL}/order/edit`, payload);
  }
}
