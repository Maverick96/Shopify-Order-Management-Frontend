import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../shared/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orderList$: Subscription;
  offset: number = 0;
  limit: number;
  currentPage: number = 1;
  orderListData: any[] = [];
  sortBy: any = {};
  totalItems: number = 0;
  columnList: any[] = [
    {
      text: 'Order Number',
      id: 'orderNumber',
      sortAsc: true
    },
    {
      text: 'Email Id',
      id: 'email',
      sortAsc: true
    },
    {
      text: 'Mobile',
      id: 'mobile',
      sortAsc: true
    },
    {
      text: 'Total Price',
      id: 'cost',
      sortAsc: true
    }

  ]
  paginationList: number[] = [5, 10, 20];
  constructor(private orderService: OrderService,
    private toastrService: ToastrService,
    private router: Router) {
    this.sortBy = this.columnList[0];
    this.limit = this.paginationList[0];
  }

  ngOnInit() {
    this.setDefaultState();
    this.fetchList();
  }

  setDefaultState() {
    localStorage.removeItem('order');
    const page_size = localStorage.getItem('page_size');
    if (page_size) {
      this.limit = JSON.parse(page_size);
    }

    const current_page = localStorage.getItem('current_page');
    if (current_page) {
      this.currentPage = JSON.parse(current_page);
    }

    const sort_by = localStorage.getItem('sort_by');
    if (sort_by) {
      this.sortBy = JSON.parse(sort_by);
    }
  }

  fetchList() {
    console.log("FETCH ")
    let sort = this.sortBy['id'];
    if (!this.sortBy['sortAsc']) {
      sort = '-' + sort;
    }

    this.orderList$ = this.orderService.getOrdersList(sort, this.offset, this.limit).subscribe(res => {
      console.log(res)
      if (res['data']) {
        this.orderListData = res['data'];
        this.totalItems = res['total'];
      } else {
        this.orderListData = [];
        this.totalItems = 0;
      }

    },
      err => {
        this.toastrService.error("Order List Failed", '', {
          timeOut: 3000
        })
        console.error(err)
      })
  }

  openDetails(order) {
    console.log(order);
    localStorage.setItem('order', JSON.stringify(order));
    this.router.navigate(['order-details', order['orderNumber']])
  }

  changeSort(column) {
    if (column['id'] === this.sortBy['id']) {
      this.sortBy['sortAsc'] = !this.sortBy['sortAsc'];
    } else {
      this.sortBy = column;
    }
    this.fetchList();
    this.setSortBy();
  }

  prevPage() {
    this.currentPage--;
    this.offset = (this.currentPage - 1) * this.limit;
    this.fetchList();
    this.setCurrentPage();
  }

  nextPage() {
    this.offset = this.currentPage * this.limit;
    this.currentPage++;
    this.fetchList();
    this.setCurrentPage();
  }

  changePagination(event) {
    this.offset = 0;
    this.sortBy = this.columnList[0];
    this.fetchList();
    this.setPageSize();
  }

  setPageSize() {
    localStorage.setItem('page_size', JSON.stringify(this.limit));
  }

  setCurrentPage() {
    localStorage.setItem('currrent_page', JSON.stringify(this.currentPage))
  }

  setSortBy() {
    localStorage.setItem('sort_by', JSON.stringify(this.sortBy))
  }


  ngOnDestroy() {
    if (this.orderList$) {
      this.orderList$.unsubscribe();
    }
  }

}
