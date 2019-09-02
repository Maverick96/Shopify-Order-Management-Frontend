import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    {
        path: 'order-list',
        component: OrderListComponent,
    },
    {
        path: 'order-details/:id',
        component: OrderDetailsComponent,
    },
    {
        path: '',
        redirectTo: '/order-list',
        pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
];

export { appRoutes };