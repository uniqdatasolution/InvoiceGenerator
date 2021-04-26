import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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

  getCustomers() {
    return this.http.get(`${this.apiUrl}/Customers/GetAllCustomers`)
    .pipe(
      catchError(this.handleError('GetCustomers', null))
    )
  }

  saveCustomer(customer: any) {
    return this.http.post(`${this.apiUrl}/Customers/SaveCustomer`, customer)
    .pipe(
      catchError(this.handleError('save customer', null))
    )
  }

  getCustomerById(id: any) {
    return this.http.get(`${this.apiUrl}/Customers/GetCustomerById/`+id)
    .pipe(
      catchError(this.handleError('GetCustomers by id', null))
    )
  }

  activeDeactiveCustomer(CustomerId: any, IsActive: any) {
    return this.http.get(`${this.apiUrl}/Customers/ActivateDeactivateCustomer`+'?CustomerId='+CustomerId+'&IsActive='+IsActive)
    .pipe(
      catchError(this.handleError('GetCustomers by id', null))
    )
  }

  deleteCustomer(id: any) {
    return this.http.delete(`${this.apiUrl}/Customers/DeleteCustomerById/`+id)
    .pipe(
      catchError(this.handleError('delete Customers by id', null))
    )
  }

}
