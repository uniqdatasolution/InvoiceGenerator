import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

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

  getAllInvoices() {
    return this.http.get(`${this.apiUrl}/Invoice/GetInvoiceList`)
    .pipe(
      catchError(this.handleError('GetInvoices', null))
    )
  }

  getInvoiceDetailsList() {
    return this.http.get(`${this.apiUrl}/Invoice/GetInvoiceDetailsList`)
    .pipe(
      catchError(this.handleError('GetInvoicedetails', null))
    )
  }

  saveInvoice(invoice: any) {
    return this.http.post(`${this.apiUrl}/Invoice/SaveInvoice`, invoice)
    .pipe(
      catchError(this.handleError('save invoice', null))
    )
  }

  saveInvoiceDetail(invoiceDetail: any) {
    return this.http.post(`${this.apiUrl}/Invoice/SaveInvoiceDetail`, invoiceDetail)
    .pipe(
      catchError(this.handleError('save invoiceDetail', null))
    )
  }

  getInvoiceById(id: any) {
    return this.http.get(`${this.apiUrl}/Invoice/GetInvoiceByInvoiceId/`+id)
    .pipe(
      catchError(this.handleError('GetCustomers by id', null))
    )
  }

  getInvoiceDetailsByInvoiceId(id: any) {
    return this.http.get(`${this.apiUrl}/Invoice/GetInvoiceDetailsListByInvoiceId/`+id)
    .pipe(
      catchError(this.handleError('GetCustomers by id', null))
    )
  }

  getInvoiceDetailByInvoiceDetailId(id: any) {
    return this.http.get(`${this.apiUrl}/Invoice/GetInvoiceDetailByInvoiceDetailId/`+id)
    .pipe(
      catchError(this.handleError('GetCustomers by id', null))
    )
  }

  // activeDeactiveCustomer(CustomerId: any, IsActive: any) {
  //   return this.http.get(`${this.apiUrl}/Invoice/ActivateDeactivateCustomer`+'?CustomerId='+CustomerId+'&IsActive='+IsActive)
  //   .pipe(
  //     catchError(this.handleError('GetCustomers by id', null))
  //   )
  // }

  deleteInvoiceById(id: any) {
    return this.http.delete(`${this.apiUrl}/Invoice/DeleteInvoiceById/`+id)
    .pipe(
      catchError(this.handleError('delete invoice by id', null))
    )
  }

  deleteInvoiceDetailById(id: any) {
    return this.http.delete(`${this.apiUrl}/Invoice/DeleteInvoiceDetailById/`+id)
    .pipe(
      catchError(this.handleError('delete invoice detail by id', null))
    )
  }

}
