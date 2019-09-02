import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    this.loaderService.setLoaderState(true);
    const self = this;
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
          self.loaderService.setLoaderState(false);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("hi", error)
        this.loaderService.setLoaderState(false);
        return throwError(error);
      }));
  }
}
