import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from '../../../Models/category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../Services/category.service';
import { AppService } from '../../../Services/app-service.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  categoriesList: any = [];
  editForm: any = FormGroup;
  categoryModel: CategoryModel = new CategoryModel();
  id: any;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private appService: AppService
  ) { 
    this.editForm = this.fb.group({
      CategoryName: ['', Validators.required],
      ParentId: [''],
    });
  }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.id = params.id;
      this.categoryService.getCategoryById(this.id).subscribe((res: any) => {
        console.log('=================get cat by is', res)
        if(res.status) {
          let data = res.data[0];
          this.categoryModel.CategoryId = data.CategoryId;
          this.editForm.get('CategoryName').setValue(data.CategoryName);
          this.editForm.get('ParentId').setValue(data.ParentId);
          this.getCategoriesList();
        }
      })
    })
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
    console.log("editForm "+JSON.stringify(this.editForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.categoryModel.CreatedBy = parseInt(userId);
      this.categoryModel.ModifiedBy = parseInt(userId);
    }
    this.updateCategory();
  }

  updateCategory = () => {

    console.log( this.categoryModel)
    this.categoryModel.CategoryName = this.editForm.value.CategoryName;
    this.categoryModel.ParentId = this.editForm.value.ParentId;
    
    console.log('==cat', this.categoryModel);
    this.categoryService.saveCategory(this.categoryModel).subscribe((data: any) => {
      if (!!data) {
        if (data.IsExist) {
          this.toastr.error("Category is already exist in system.", "", { timeOut: 25000 })
        } else {
          this.toastr.success('Category has been Updated successfully', 'Success');
          this.route.navigateByUrl("dashboard/categories");
        }
      } else {
        this.toastr.error("Something Wrong!", "Error");
      }
    });
  }

}
