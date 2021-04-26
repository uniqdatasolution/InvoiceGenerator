import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.base_url}`;
  private handleError: HandleError;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = this.httpErrorHandler.createHandleError('AppService')
  }

  getProducts() {
    return this.http.get(`${this.apiUrl}/Product/GetAllProducts`)
    .pipe(
      catchError(this.handleError('GetAllProducts list', null))
    )
  }

  saveProduct(product: any) {
    return this.http.post(`${this.apiUrl}/Product/SaveProduct`, product)
    .pipe(
      catchError(this.handleError('save product', null))
    )
  }

  getProductById(id: any) {
    return this.http.get(`${this.apiUrl}/Product/GetProductByProductId/`+id)
    .pipe(
      catchError(this.handleError('GetProductByProductId', null))
    )
  }

  getProductsByCategoryId(id: any) {
    return this.http.get(`${this.apiUrl}/Product/GetProductsByCategoryId/`+id)
    .pipe(
      catchError(this.handleError('GetProductsByCategoryId', null))
    )
  }

  deleteProduct(id: any) {
    return this.http.delete(`${this.apiUrl}/Product/DeleteProductById/`+id)
    .pipe(
      catchError(this.handleError('delete Product by id', null))
    )
  }
}
