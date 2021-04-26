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
import { CategoryService } from './../../Services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categoriesList: any = [];

  displayedColumns: string[] = ['CategoryId', 'CategoryName', 'ParentId', 'Action'];
  dataSource = new MatTableDataSource;
  search = new FormControl("");

  @ViewChild(MatPaginator, { static: false }) paginator: any = MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;

  constructor(
    private route: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getCategoriesList();
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

  getCategoriesList() {
    this.categoriesList = [];
    this.categoryService.getCategories().subscribe((res: any) => {
      // console.log('===============res for customers', res);
      if(res.status) {
        this.categoriesList = res.data;
        this.dataSource = new MatTableDataSource(this.categoriesList);
        this.dataSource.sort = this.sort;
        setTimeout(() => this.dataSource.paginator = this.paginator);
      }
    })
  }

  addCategory() {
    this.route.navigateByUrl('/dashboard/categories/add-category');
  }

  editCategory(id: any) {
    this.route.navigateByUrl('/dashboard/categories/edit-category/'+id);
  }

  deleteCategory(categoryId: any) {
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
        this.categoryService.deleteCategory(categoryId).subscribe((response: any) => {
          console.log('=====res delete', response)
          if (response) {
            if(response.data[0].IsDeleted) {
              Swal.fire('', 'Poof! Your record has been deleted!', 'success');
              this.getCategoriesList();
            } else {
              Swal.fire('', 'Poof! You cannot able to delete this Category because of some other reference is present!', 'error');
              this.getCategoriesList();
            }
          }
        });
      }
    });
  } 

}
