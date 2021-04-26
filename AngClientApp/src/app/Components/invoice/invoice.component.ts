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
import { InvoiceService } from './../../Services/invoice.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  invoiceList: any = [];

  displayedColumns: string[] = ['InvoiceNumber', 'CustomerName', 'InvoiceDate', 'TotalAmount', 'Action'];
  dataSource = new MatTableDataSource;
  search = new FormControl("");

  @ViewChild(MatPaginator, { static: false }) paginator: any = MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;

  constructor(
    private route: Router,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private appService: AppService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInvoiceList();
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

  getInvoiceList() {
    this.invoiceList = [];
    this.invoiceService.getAllInvoices().subscribe((res: any) => {
      // console.log('===============res for customers', res);
      if(res.status) {
        this.invoiceList = res.data;
        this.dataSource = new MatTableDataSource(this.invoiceList);
        this.dataSource.sort = this.sort;
        setTimeout(() => this.dataSource.paginator = this.paginator);
      }
    })
  }

  addInvoice() {
    // this.route.navigateByUrl('/dashboard/invoice/add-product');
    const dialogRef = this.dialog.open(AddInvoiceComponent, {
      minWidth: '40%',
      data: {
        animal: 'panda'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getInvoiceList();
    });
  }

  download(invoiceId: any, customerId: any) {
    const url = this.route.serializeUrl(
      this.route.createUrlTree(['dashboard/invoice/download-invoice/'+invoiceId+'/'+customerId])
    );
  
    window.open(url, '_blank');
    console.log('======================================show download')
  }

  editInvoice(id: any) {
    // this.route.navigateByUrl('/dashboard/invoice/edit-product/'+id);
    const dialogRef = this.dialog.open(EditInvoiceComponent, {
      minWidth: '40%',
      data: {
        invoiceId: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getInvoiceList();
    });
  }

  deleteInvoice(invoiceId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        Swal.fire('', 'Your record is safe!', 'error');
      } else {
        this.invoiceService.deleteInvoiceById(invoiceId).subscribe((response: any) => {
          console.log('=====res delete', response)
          if (response) {
            if(response.data[0].IsDeleted) {
              Swal.fire('', 'Poof! Your record has been deleted!', 'success');
              this.getInvoiceList();
            } else {
              Swal.fire('', 'Poof! You cannot able to delete this Invoice because of some other reference is present!', 'error');
              this.getInvoiceList();
            }
          }
        });
      }
    });
  } 


}
