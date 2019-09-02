import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { MOBILE_REGEX } from '../shared/constants/app.contants';

interface IFormState {
  email: String,
  mobile: String
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private toastrService: ToastrService
  ) { }
  orderDetails$: Subscription;
  orderEdit$: Subscription;
  orderNumber: number;
  orderForm: FormGroup;
  isFormCreated: boolean = false;
  orderItems: any[] = [];
  formValues = {
    email: null,
    mobile: null
  };

  initialState: IFormState = {
    email: null,
    mobile: null
  };

  hasFormChanged: boolean = false;

  itemDetailsColumns = [
    {
      text: 'Item Name',
      id: 'name',
    },
    {
      text: 'Quantity',
      id: 'quantity',
    },
    {
      text: 'Price',
      id: 'cost',
    },
  ]

  ngOnInit() {
    this.setInitialState();
    this.fetchDetails();
  }

  setInitialState() {
    const order = JSON.parse(localStorage.getItem('order'));
    console.log("ORDER ", order)
    this.createForm(order);
    this.initialState = {
      email: order.email,
      mobile: order.mobile
    };
  }

  createForm(values) {
    console.log("VAL ", values.mobile)
    this.orderForm = this.fb.group({
      email: [values.email, []],
      mobile: [values.mobile, []],
    });
    this.isFormCreated = true;
  }

  fetchDetails() {
    this.orderNumber = this.route.snapshot.params['id'];
    this.orderDetails$ = this.orderService.getOrderDetails(this.orderNumber).subscribe(res => {
      console.log(res);
      this.orderItems = res['data'];
    },
      err => {
        console.error(err)
      })
  }

  back() {
    this.location.back();
  }

  onSubmit() {
    if (this.orderForm.valid && this.hasFormChanged) {
      const payload = {
        orderNumber: this.orderNumber,
        email: this.orderForm.value['email'],
        mobile: this.orderForm.value['mobile']
      }
      this.orderEdit$ = this.orderService.updateOrderDetails(payload)
        .subscribe(res => {
          if (res['success']) {
            this.toastrService.success("Details Edited Successfully", '', {
              timeOut: 3000
            });
            this.router.navigate(['order-list'])
          } else {
            this.toastrService.error("Details Edit Failed", '', {
              timeOut: 5000
            });
            // revert changes if update fails
            this.setInitialState();
          }
        },
          err => {
            this.toastrService.error("Details Edit Failed", '', {
              timeOut: 5000
            });
            // revert changes if update fails
            this.setInitialState();
            console.error(err)
          })

    }
  }

  checkFormStatus(event) {
    if (this.orderForm.controls['email'].value !== this.initialState.email || this.orderForm.controls['mobile'].value !== this.initialState.mobile) {
      this.hasFormChanged = true;
    } else {
      this.hasFormChanged = false;
    }

    if (this.orderForm.controls['mobile'].value !== null) {
      this.orderForm.controls['mobile'].setValidators([Validators.pattern(MOBILE_REGEX)]);
    } else {
      this.orderForm.controls['mobile'].setValidators(null);
    }


    if (this.orderForm.controls['email'].value !== null) {
      this.orderForm.controls['email'].setValidators([Validators.email]);
    } else {
      this.orderForm.controls['email'].setValidators(null);
    }

    this.orderForm.updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.orderDetails$) {
      this.orderDetails$.unsubscribe();
    }
    if (this.orderEdit$) {
      this.orderEdit$.unsubscribe();
    }
  }

}
