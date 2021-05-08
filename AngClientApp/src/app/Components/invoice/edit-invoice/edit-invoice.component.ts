import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InvoiceDetailModel, InvoiceModel } from 'src/app/Models/invoice.model';
import { AppService } from 'src/app/Services/app-service.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { ProductService } from 'src/app/Services/product.service';

export interface DialogData {
  invoiceId: any,
  customerId: any
}

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})
export class EditInvoiceComponent implements OnInit {

  invoiceId: any;
  invoiceModel: InvoiceModel = new InvoiceModel();
  invoiceDetailModel: InvoiceDetailModel = new InvoiceDetailModel();

  customersList: any;
  customerId: any;
  customerDetails: any = {};
  productList: any;
  showAdd = false;
  showAddDetail = false;
  productDetails: any;
  fieldArray: any = [];
  newAttribute: any = {};
  invoiceById: any = {};
  invoiceDetailsByInvoiceId: any = [];
  editForm: any = FormGroup;

  colorControl= new FormControl();

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private projectService: ProductService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log('======================data', data);
    this.invoiceId = data.invoiceId;
    this.customerId = data.customerId;
    this.colorControl = new FormControl(this.customerId);
    this.editForm = this.fb.group({
      GRRRNo: [''],
      Transport: [''],
      VehicleNo: [''],
      Station: [''],
    });
  }

  ngOnInit(): void {
    this.getInvoicebyId();
    this.getProductsList();
  }

  getInvoicebyId() {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe((res: any) => {
      console.log('==============res for invoice', res);
      if(res.status) {
        this.invoiceById = res.data[0];
        this.invoiceModel.InvoiceId = res.data[0].InvoiceId;
        this.invoiceModel.InvoiceDate = res.data[0].InvoiceDate;
        this.invoiceModel.CustomerId = res.data[0].CustomerId;
        this.editForm.get('GRRRNo').setValue(res.data[0].GRRRNo);
        this.editForm.get('Transport').setValue(res.data[0].Transport);
        this.editForm.get('VehicleNo').setValue(res.data[0].VehicleNo);
        this.editForm.get('Station').setValue(res.data[0].Station);
        this.getCustomers();
        this.getCustomerById(res.data[0].CustomerId);
        this.invoiceModel.TotalAmount = res.data[0].TotalAmount;
        this.invoiceModel.CreatedBy = res.data[0].CreatedBy;

        this.invoiceService.getInvoiceDetailsByInvoiceId(this.invoiceId).subscribe((response: any) => {
          console.log('==============res for invoice details', response);
          if(response.status) {
            this.invoiceDetailsByInvoiceId = response.data;
            this.fieldArray = response.data;
            this.getProductsList();
          }
        })
      }
    })
  }

  getCustomerById(custId: any) {
    this.customerService.getCustomerById(custId).subscribe((res: any) => {
      if(res.status) {
        this.showAdd = true;
        this.customerDetails = res.data[0];
      }
    })
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe((res: any) => {
      if(res.status) {
        this.customersList = res.data;
      }
    })
  }

  SelectCustomer(customerId: any) {
    this.customerId = customerId;
    this.getProductsList();
  }

  addInvoiceDetail() {
    console.log('======================add invoice detail')
    this.showAddDetail = true;
    this.getProductsList();
  }

  getProductsList() {
    this.projectService.getProducts().subscribe((res: any) => {
      if(res.status) {
        this.productList = res.data;
      }
    })
  }

  SelectProduct1(productId: any, index: any) {
    this.projectService.getProductById(productId).subscribe((res: any) => {
      if(res.status) {
        this.productDetails = res.data[0];
        // this.newAttribute.Rate = res.data[0].UnitPrice;
        this.fieldArray[index].Rate = res.data[0].UnitPrice;
        this.fieldArray[index].ProductId = productId;
        this.fieldArray[index].Amount = this.fieldArray[index].Rate * this.fieldArray[index].Quantity;
      }
    })
  }

  async onQuantityChange(qty: any, index: any) {
    let rate = this.fieldArray[index].Rate;
    let quantity = qty.target.value;
    let invoiceAmount = await quantity*rate;
    this.fieldArray[index].Amount = invoiceAmount;
  }

  SelectProduct(productId: any) {
    this.projectService.getProductById(productId).subscribe((res: any) => {
      if(res.status) {
        this.productDetails = res.data[0];
        this.newAttribute.Rate = res.data[0].UnitPrice;
      }
    })
  }

  async onQuantityChange1(qty: any) {
    console.log('=====================text per new', qty, qty.target.value, this.newAttribute.Rate);
    let rate = this.newAttribute.Rate;
    let quantity = qty.target.value;
    let invoiceAmount = await quantity*rate;
    this.newAttribute.Amount = invoiceAmount;
  }

  editFieldValue(index: any, field: any) {
    console.log('=====================edit', index, field)
    this.fieldArray.splice(index, 1, field)
    console.log('===========123 after edit ', this.fieldArray);
    this.getProductsList();

  }

  deleteFieldValue(index: any) {
    this.fieldArray.splice(index, 1);
  }

  addFieldValue() {
    console.log('====================this.ads', )
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
    this.showAddDetail=false;
    console.log('===========123', this.fieldArray);
    this.getProductsList();
  }

  cancel() {
    this.showAddDetail = false;
  }

  async saveInvoiceDetails() {
    console.log('==========================================12334');
   
    var userId = localStorage.getItem('UserId') || '{}';
    this.invoiceModel.InvoiceDate = new Date();
    // this.invoiceModel.CreatedBy = parseInt(userId);
    this.invoiceModel.ModifiedBy = parseInt(userId);

    let i;
    let InvoiceAmount=0;
    for (i = 0;await i < this.fieldArray.length; i++){
      InvoiceAmount = InvoiceAmount + this.fieldArray[i].Amount
      console.log('=================amount', InvoiceAmount);
    }
    this.invoiceModel.TotalAmount = InvoiceAmount;
    this.invoiceModel.CustomerId = this.customerId;
    this.invoiceModel.GRRRNo = this.editForm.value.GRRRNo;
    this.invoiceModel.Transport = this.editForm.value.Transport;
    this.invoiceModel.VehicleNo = this.editForm.value.VehicleNo;
    this.invoiceModel.Station = this.editForm.value.Station;
    this.invoiceService.saveInvoice(this.invoiceModel).subscribe((res: any) => {
      console.log('====================res for invoice', res)
      if(res.status) {
        let invoiceId = res.data[0].InvoiceId;
        if(invoiceId != 0 ) {
          let j;
          let DetailfieldArray: any = [];
          for(j=0; j < this.fieldArray.length; j++) {
            console.log('=================field array', this.fieldArray[j])
            if(this.fieldArray[j].InvoiceDetailId>0) {
              var invoiceDetails = {
                "InvoiceDetailId": this.fieldArray[j].InvoiceDetailId,
                "InvoiceId": invoiceId,
                "ProductId": this.fieldArray[j].ProductId,
                "Rate": this.fieldArray[j].Rate,
                "Quantity": this.fieldArray[j].Quantity,
                "Amount": this.fieldArray[j].Amount,
              }
              DetailfieldArray.push(invoiceDetails);
            } else {
              var invoiceDetails1 = {
                "InvoiceDetailId": 0,
                "InvoiceId": invoiceId,
                "ProductId": this.fieldArray[j].ProductId,
                "Rate": this.fieldArray[j].Rate,
                "Quantity": this.fieldArray[j].Quantity,
                "Amount": this.fieldArray[j].Amount,
              }
              DetailfieldArray.push(invoiceDetails1);
            }
          }
          console.log('===========================array to push', DetailfieldArray)
          // debugger;
          this.invoiceService.saveInvoiceDetail(DetailfieldArray).subscribe((response: any) => {
            console.log('====================res for invoice details', response)
            if(response.status) {
              this.toastr.success('Invoice and Invoice Details are updated Successfully!');
              this.dialogRef.close();
            } else {
              this.toastr.error('Something went wrong!');
              this.dialogRef.close();
            }
          })
        }
      } else {
        this.toastr.error('Something went wrong!');
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
