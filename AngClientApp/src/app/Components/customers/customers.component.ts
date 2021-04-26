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
import { CustomerService } from '../../Services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customersList: any = [];

  displayedColumns: string[] = ['FirstName', 'Email', 'MobileNumber', 'Country', 'Status', 'Action'];
  dataSource = new MatTableDataSource;
  search = new FormControl("");

  @ViewChild(MatPaginator, { static: false }) paginator: any = MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;

  constructor(
    private route: Router,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getCustomersList();
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

  getCustomersList() {
    this.customersList = [];
    this.customerService.getCustomers().subscribe((res: any) => {
      // console.log('===============res for customers', res);
      if(res.status) {
        res.data.forEach(async (element: any) => {
          let item = element;
          await this.appService.getCountryByCountryId(item.Country).subscribe(async (res: any) => {
            console.log('===========itrm', res);
            item.CountryName = res.data[0].CountryName;
            await this.customersList.push(item);
            console.log('==================data', this.customersList)
            this.dataSource = new MatTableDataSource(this.customersList);
            this.dataSource.sort = this.sort;
            setTimeout(() => this.dataSource.paginator = this.paginator);
          })
        });
      }
    })
  }

  addCustomer() {
    this.route.navigateByUrl('/dashboard/customers/add-customer');
  }

  ActivateOrDeactivate(customerId: any, value: any) {
    let message = "Do you want to Activate this customer?";
    if (!value) {
        message = "Do you want to Deactivate this customer?";
    }
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
        if (!willDelete.dismiss) {
          console.log('===111111111111')
            this.customerService.activeDeactiveCustomer(customerId, value).subscribe((response: any) => {
                if (response) {
                    this.toastr.success('Customer status has been updated successfully', 'Success');
                    this.getCustomersList();
                    const index = _.findIndex(this.customersList, (p: any) => p.customerId === customerId);
                    if (index >= 0) {
                        this.customersList[index].IsActive = value;
                    }
                }
            });
        }
    });
  }

  editCustomer(customerId: any) {
    this.route.navigateByUrl('/dashboard/customers/edit-customer/'+ customerId);
  }

  deleteCustomer(customerId: any) {
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
      this.customerService.deleteCustomer(customerId).subscribe((response: any) => {
        console.log('=====res delete', response)
        if (response) {
          if(response.data[0].IsDeleted) {
            Swal.fire('', 'Poof! Your record has been deleted!', 'success');
            this.getCustomersList();
          } else {
            Swal.fire('', 'Poof! You cannot able to delete this Customer because of some other reference is present!', 'error');
            this.getCustomersList();
          }
        }
      });
    }
  });
  } 

}
