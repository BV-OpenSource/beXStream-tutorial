import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebStorageService } from '../web-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private webStorage: WebStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const apiToken = this.webStorage.getStoredToken();
    if (apiToken) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${apiToken}`,
                // 'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
    return next.handle(request);
  }
}
