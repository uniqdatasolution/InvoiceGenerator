import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './Components/categories/add-category/add-category.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { EditCategoryComponent } from './Components/categories/edit-category/edit-category.component';
import { AddCustomerComponent } from './Components/customers/add-customer/add-customer.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { EditCustomerComponent } from './Components/customers/edit-customer/edit-customer.component';
import { HomeComponent } from './Components/home/home.component';
import { DownloadInvoiceComponent } from './Components/invoice/download-invoice/download-invoice.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { LoginComponent } from './Components/login/login.component';
import { AddProductComponent } from './Components/products/add-product/add-product.component';
import { EditProductComponent } from './Components/products/edit-product/edit-product.component';
import { ProductsComponent } from './Components/products/products.component';
import { SettingsComponent } from './Components/settings/settings.component';

const routes: Routes = [
  {                                          // removed square bracket
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: HomeComponent
  },
  {
    path: 'dashboard/customers',
    component: CustomersComponent
  },
  {
    path: 'dashboard/customers/add-customer',
    component: AddCustomerComponent
  },
  {
    path: 'dashboard/customers/edit-customer/:id',
    component: EditCustomerComponent
  },
  {
    path: 'dashboard/categories',
    component: CategoriesComponent
  },
  {
    path: 'dashboard/categories/add-category',
    component: AddCategoryComponent
  },
  {
    path: 'dashboard/categories/edit-category/:id',
    component: EditCategoryComponent
  },
  {
    path: 'dashboard/products',
    component: ProductsComponent
  },
  {
    path: 'dashboard/products/add-product',
    component: AddProductComponent
  },
  {
    path: 'dashboard/products/edit-product/:id',
    component: EditProductComponent
  },
  {
    path: 'dashboard/invoice',
    component: InvoiceComponent
  },
  {
    path: 'dashboard/invoice/download-invoice/:id/:cid',
    component: DownloadInvoiceComponent
  },
  {
    path: 'dashboard/settings',
    component: SettingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
