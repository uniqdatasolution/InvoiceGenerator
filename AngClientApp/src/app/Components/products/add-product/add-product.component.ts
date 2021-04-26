import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from '../../../Models/product.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../Services/app-service.service';
import { ProductService } from '../../../Services/product.service';
import { CategoryService } from '../../../Services/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  categoriesList: any = [];
  createForm: any = FormGroup;
  productModel: ProductModel = new ProductModel();

  constructor(
    private route: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private appService: AppService
  ) {
    this.createForm = this.fb.group({
      ProductName: ['', Validators.required],
      CategoryId: ['', Validators.required],
      Description: ['', Validators.required],
      UnitPrice: ['', Validators.required],
      QuantityOnHand: ['', Validators.required],
      Height: [''],
      Width: [''],
      Weight: [''],
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
    this.route.navigateByUrl('/dashboard/products');
  }

  onSubmit() {
    console.log("createForm "+JSON.stringify(this.createForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.productModel.CreatedBy = parseInt(userId);
      this.productModel.ModifiedBy = parseInt(userId);
    }
    this.insertCategory();
  }

  insertCategory = () => {

    console.log( this.productModel)
    this.productModel.CategoryId = this.createForm.value.CategoryId;
    this.productModel.ProductName = this.createForm.value.ProductName;
    this.productModel.Description = this.createForm.value.Description;
    this.productModel.UnitPrice = this.createForm.value.UnitPrice;
    this.productModel.QuantityOnHand = this.createForm.value.QuantityOnHand;
    this.productModel.Height = this.createForm.value.Height;
    this.productModel.Width = this.createForm.value.Width;
    this.productModel.Weight = this.createForm.value.Weight;
    
    console.log('==cat', this.productModel);
    this.productService.saveProduct(this.productModel).subscribe((data: any) => {
      if (!!data) {
        if (data.IsExist) {
          this.toastr.error("Product is already exist in system.", "", { timeOut: 25000 })
        } else {
          this.toastr.success('Product has been Added successfully', 'Success');
          this.route.navigateByUrl("dashboard/products");
        }
      } else {
        this.toastr.error("Something Wrong!", "Error");
      }
    });
  }

}
