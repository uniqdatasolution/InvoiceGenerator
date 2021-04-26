import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

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
    this.handleError = this.httpErrorHandler.createHandleError('AppServiceService')
  }

  validateUser(user: any) {
    return this.http.post(`${this.apiUrl}/Vendors/ValidateVendor`, user)
    .pipe(
      catchError(this.handleError('validate user', null))
    )
  }

  getVendorById(id: any) {
    return this.http.get(`${this.apiUrl}/Vendors/GetVendorById/`+id)
    .pipe(
      catchError(this.handleError('getVendorById', null))
    )
  }

  getCountryList() {
    return this.http.get(`${this.apiUrl}/GetCountryList`)
    .pipe(
      catchError(this.handleError('GetCountryList', null))
    )
  }

  getStateListByCountryId(countryId: any) {
    return this.http.get(`${this.apiUrl}/GetStatesByCountryId/`+countryId)
    .pipe(
      catchError(this.handleError('GetStatesByCountryId', null))
    )
  }

  getCityListByStateId(stateId: any) {
    return this.http.get(`${this.apiUrl}/GetCitiesByStateId/`+stateId)
    .pipe(
      catchError(this.handleError('GetStatesBystateId', null))
    )
  }

  getCountryByCountryId(countryId: any) {
    return this.http.get(`${this.apiUrl}/GetCountryByCountryId/`+countryId)
    .pipe(
      catchError(this.handleError('GetCountryByCountryId', null))
    )
  }

  getStateByStateId(stateId: any) {
    return this.http.get(`${this.apiUrl}/GetStateByStateId/`+stateId)
    .pipe(
      catchError(this.handleError('GetStateByStateId', null))
    )
  }

  getCityByCityId(cityId: any) {
    return this.http.get(`${this.apiUrl}/GetCityByCityId/`+cityId)
    .pipe(
      catchError(this.handleError('GetCityByCityId', null))
    )
  }

  getDepartmentList() {
    return this.http.get(`${this.apiUrl}/GetDepartmentList/`)
    .pipe(
      catchError(this.handleError('GetDepartmentList', null))
    )
  }

  getEmployeeList() {
    return this.http.get(`${this.apiUrl}/GetEmployeeList/`)
    .pipe(
      catchError(this.handleError('GetEmployeeList', null))
    )
  }

  getCurrencyList() {
    return this.http.get(`${this.apiUrl}/GetCurrencyList/`)
    .pipe(
      catchError(this.handleError('GetCurrencyList', null))
    )
  }

  getEmployeeByEmployeeId(employeeId: any) {
    return this.http.get(`${this.apiUrl}/GetEmployeeByEmployeeId/`+employeeId)
    .pipe(
      catchError(this.handleError('GetEmployeeByEmployeeId', null))
    )
  }

}
