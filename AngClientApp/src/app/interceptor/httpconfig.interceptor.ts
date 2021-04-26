import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: any = localStorage.getItem('token');
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
        });
        return next.handle(request);
    }
}