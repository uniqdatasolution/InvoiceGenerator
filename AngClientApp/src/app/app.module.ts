import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpErrorHandler } from './Services/http-error-handler.service';
import { MessageService } from './Services/message.service';
import { LoaderService } from './Services/loader.service';
import { MyLoaderComponent } from './Components/my-loader/my-loader.component';
import { LoaderInterceptor } from './interceptor/loader-interceptor.service';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { CustomersComponent } from './Components/customers/customers.component';
import { AddCustomerComponent } from './Components/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './Components/customers/edit-customer/edit-customer.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { AddCategoryComponent } from './Components/categories/add-category/add-category.component';
import { EditCategoryComponent } from './Components/categories/edit-category/edit-category.component';
import { ProductsComponent } from './Components/products/products.component';
import { AddProductComponent } from './Components/products/add-product/add-product.component';
import { EditProductComponent } from './Components/products/edit-product/edit-product.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { AddInvoiceComponent } from './Components/invoice/add-invoice/add-invoice.component';
import { EditInvoiceComponent } from './Components/invoice/edit-invoice/edit-invoice.component';
import { DownloadInvoiceComponent } from './Components/invoice/download-invoice/download-invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MyLoaderComponent,
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CategoriesComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    InvoiceComponent,
    AddInvoiceComponent,
    EditInvoiceComponent,
    DownloadInvoiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    HttpErrorHandler,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
