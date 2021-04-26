import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { AppService } from '../../Services/app-service.service';
import { ProductService } from './../../Services/product.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  productsList: any = [];

  displayedColumns: string[] = ['ProductName', 'CategoryName', 'UnitPrice', 'Action'];
  dataSource = new MatTableDataSource;
  search = new FormControl("");

  @ViewChild(MatPaginator, { static: false }) paginator: any = MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;

  constructor(
    private route: Router,
    private productService: ProductService,
    private toastr: ToastrService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getProductsList();
    this.search.valueChanges
      .pipe(debounceTime(100))
      .subscribe(searchText => {
        console.log('==text', searchText);
        // this.sText = searchText;
        this.applyFilter(searchText);
    });
  }

  applyFilter(filterValue: string) {
    // console.log('===filtering', filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getProductsList() {
    this.productsList = [];
    this.productService.getProducts().subscribe((res: any) => {
      // console.log('===============res for customers', res);
      if(res.status) {
        this.productsList = res.data;
        this.dataSource = new MatTableDataSource(this.productsList);
        this.dataSource.sort = this.sort;
        setTimeout(() => this.dataSource.paginator = this.paginator);
      }
    })
  }

  addProduct() {
    this.route.navigateByUrl('/dashboard/products/add-product');
  }

  editProduct(id: any) {
    this.route.navigateByUrl('/dashboard/products/edit-product/'+id);
  }

  deleteProduct(productId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      // type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        Swal.fire('', 'Your record is safe!', 'error');
      } else {
        this.productService.deleteProduct(productId).subscribe((response: any) => {
          console.log('=====res delete', response)
          if (response) {
            if(response.data[0].IsDeleted) {
              Swal.fire('', 'Poof! Your record has been deleted!', 'success');
              this.getProductsList();
            } else {
              Swal.fire('', 'Poof! You cannot able to delete this Product because of some other reference is present!', 'error');
              this.getProductsList();
            }
          }
        });
      }
    });
  } 

}
