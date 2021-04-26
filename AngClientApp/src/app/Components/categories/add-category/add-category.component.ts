import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from '../../../Models/category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../Services/category.service';
import { AppService } from '../../../Services/app-service.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  categoriesList: any = [];
  createForm: any = FormGroup;
  categoryModel: CategoryModel = new CategoryModel();

  constructor(
    private route: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private appService: AppService
  ) {
    this.createForm = this.fb.group({
      CategoryName: ['', Validators.required],
      ParentId: [''],
    });
   }

  ngOnInit(): void {
    this.getCategoriesList();
  }

  getCategoriesList() {
    this.categoriesList = [];
    this.categoryService.getCategories().subscribe((res: any) => {
      // console.log('===============res for Categorys', res);
      if(res.status) {
        this.categoriesList = res.data;
      }
    })
  }

  goBack() {
    this.route.navigateByUrl('/dashboard/categories');
  }

  onSubmit() {
    console.log("createForm "+JSON.stringify(this.createForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.categoryModel.CreatedBy = parseInt(userId);
      this.categoryModel.ModifiedBy = parseInt(userId);
    }
    this.insertCategory();
  }

  insertCategory = () => {

    console.log( this.categoryModel)
    this.categoryModel.CategoryName = this.createForm.value.CategoryName;
    this.categoryModel.ParentId = this.createForm.value.ParentId;
    
    console.log('==cat', this.categoryModel);
    this.categoryService.saveCategory(this.categoryModel).subscribe((data: any) => {
      if (!!data) {
        if (data.IsExist) {
          this.toastr.error("Category is already exist in system.", "", { timeOut: 25000 })
        } else {
          this.toastr.success('Category has been Added successfully', 'Success');
          this.route.navigateByUrl("dashboard/categories");
        }
      } else {
        this.toastr.error("Something Wrong!", "Error");
      }
    });
  }

}
