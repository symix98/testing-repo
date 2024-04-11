import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataSourceService implements HttpInterceptor {

  constructor(private sessionStorage: SessionStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dataSource = this.sessionStorage.retrieve('data_session_storage');
    const reqInt = req.clone({
      headers: req.headers.set('dataSourceName', dataSource == null ? '' : dataSource)
    })
    return next.handle(reqInt);
  }
}