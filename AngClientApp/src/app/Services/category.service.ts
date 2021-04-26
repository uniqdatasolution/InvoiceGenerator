import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

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

  getCategories() {
    return this.http.get(`${this.apiUrl}/Category/GetAllCategories`)
    .pipe(
      catchError(this.handleError('GetCategory list', null))
    )
  }

  saveCategory(category: any) {
    return this.http.post(`${this.apiUrl}/Category/SaveCategory`, category)
    .pipe(
      catchError(this.handleError('save category', null))
    )
  }

  getCategoryById(id: any) {
    return this.http.get(`${this.apiUrl}/Category/GetCategoryById/`+id)
    .pipe(
      catchError(this.handleError('GetCategory', null))
    )
  }

  deleteCategory(id: any) {
    return this.http.delete(`${this.apiUrl}/Category/DeleteCategoryById/`+id)
    .pipe(
      catchError(this.handleError('delete Category by id', null))
    )
  }

}
