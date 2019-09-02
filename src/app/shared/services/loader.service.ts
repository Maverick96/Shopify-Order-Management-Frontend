import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  showLoader: Subject<boolean> = new Subject();
  showLoader$ = this.showLoader.asObservable();
  constructor() { }

  setLoaderState(state) {
    this.showLoader.next(state);
  }

  getLoaderState() {
    return this.showLoader$;
  }
}
