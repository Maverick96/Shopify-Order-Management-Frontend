import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  loader$: Subscription;
  isLoading: boolean = true;
  constructor(private loadingService: LoaderService) {
  }

  ngOnInit() {
    this.subscribeToLoaderService();
  }


  subscribeToLoaderService() {
    this.loader$ = this.loadingService.getLoaderState().subscribe(val => {
      this.isLoading = val;
      console.log("LOADING STATUS ", this.isLoading)
    });
  }

  ngOnDestroy() {
    if (this.loader$) {
      this.loader$.unsubscribe();
    }
  }

}
