import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from '../../../Models/product.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../Services/app-service.service';
import { ProductService } from '../../../Services/product.service';
import { CategoryService } from '../../../Services/category.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  id: any;
  categoriesList: any = [];
  editForm: any = FormGroup;
  productModel: ProductModel = new ProductModel();

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private appService: AppService
  ) {
    this.editForm = this.fb.group({
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
    this.router.params.subscribe(params => {
      this.id = params.id;
      this.productService.getProductById(this.id).subscribe((res: any) => {
        console.log('=================get cat by is', res)
        if(res.status) {
          let data = res.data[0];
          this.productModel.ProductId = data.ProductId;
          this.editForm.get('CategoryId').setValue(data.CategoryId);
          this.editForm.get('ProductName').setValue(data.ProductName);
          this.editForm.get('Description').setValue(data.Description);
          this.editForm.get('UnitPrice').setValue(data.UnitPrice);
          this.editForm.get('QuantityOnHand').setValue(data.QuantityOnHand);
          this.editForm.get('Height').setValue(data.Height);
          this.editForm.get('Width').setValue(data.Width);
          this.editForm.get('Weight').setValue(data.Weight);
          this.getCategoriesList();
        }
      })
    })
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
    console.log("editForm "+JSON.stringify(this.editForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.productModel.CreatedBy = parseInt(userId);
      this.productModel.ModifiedBy = parseInt(userId);
    }
    this.insertCategory();
  }

  insertCategory = () => {

    console.log( this.productModel)
    this.productModel.CategoryId = this.editForm.value.CategoryId;
    this.productModel.ProductName = this.editForm.value.ProductName;
    this.productModel.Description = this.editForm.value.Description;
    this.productModel.UnitPrice = this.editForm.value.UnitPrice;
    this.productModel.QuantityOnHand = this.editForm.value.QuantityOnHand;
    this.productModel.Height = this.editForm.value.Height;
    this.productModel.Width = this.editForm.value.Width;
    this.productModel.Weight = this.editForm.value.Weight;
    
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
