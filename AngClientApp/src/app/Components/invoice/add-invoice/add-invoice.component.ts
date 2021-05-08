import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/Services/app-service.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { ProductService } from 'src/app/Services/product.service';
import { InvoiceModel, InvoiceDetailModel } from './../../../Models/invoice.model';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {

  invoiceModel: InvoiceModel = new InvoiceModel();
  invoiceDetailModel: InvoiceDetailModel = new InvoiceDetailModel();

  customersList: any;
  productList: any;
  showAdd = false;
  showAddDetail = false;
  productDetails: any;
  fieldArray: any = [];
  newAttribute: any = {};
  createForm: any = FormGroup;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private projectService: ProductService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.createForm = this.fb.group({
      GRRRNo: [''],
      Transport: [''],
      VehicleNo: [''],
      Station: [''],
    });
  }

  ngOnInit(): void {
    this.getCustomersList();
  }

  getCustomersList() {
    this.customerService.getCustomers().subscribe((res: any) => {
      if(res.status) {
        this.customersList = res.data;
      }
    })
  }

  SelectCustomer(customerId: any) {
    this.invoiceModel.CustomerId = customerId;
    this.showAdd = true;
    this.getProductsList();
  }

  addInvoiceDetail() {
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
    console.log('==========================================12334')
    // let CurrencyValue = 0;
    
    // await this.invoiceService.convertCurrency(this.currencyCode).then((res: any) => {
    //   console.log('===========================res for convert currency', res);
    //   // let resp = JSON.parse(res);
    //   console.log('===========================res for convert currency111111111111111', res.results);
    //   let newres = JSON.stringify(res);
    //   let newres1 = JSON.parse(res);
    //   console.log('===========================res for convert currency12222222222222222222', newres1.results);
    //   console.log('===========================res for convert currency133333333333333', newres1.results.INR);
    //   let car = newres1.results;
    //   CurrencyValue = newres1.results.INR;
    //   if (this.currencyCode in car) {
    //     console.log('=============================test', this.currencyCode, car, car[this.currencyCode])
    //     CurrencyValue = car.INR;
    //   }
    //   // let result = res?.results?.INR;
    //   // this.invoiceModel.InvoiceAmountInINR = result * this.InvoiceAmount;
    //   // this.invoiceModel.CurrencyRate = result;
    // })
   
    var userId = localStorage.getItem('UserId') || '{}';
    this.invoiceModel.InvoiceDate = new Date();
    this.invoiceModel.CreatedBy = parseInt(userId);
    this.invoiceModel.ModifiedBy = parseInt(userId);

    let i;
    let InvoiceAmount=0;
    for (i = 0;await i < this.fieldArray.length; i++){
      InvoiceAmount = InvoiceAmount + this.fieldArray[i].Amount
      console.log('=================amount', InvoiceAmount);
    }
    this.invoiceModel.TotalAmount = InvoiceAmount;
    this.invoiceModel.GRRRNo = this.createForm.value.GRRRNo;
    this.invoiceModel.Transport = this.createForm.value.Transport;
    this.invoiceModel.VehicleNo = this.createForm.value.VehicleNo;
    this.invoiceModel.Station = this.createForm.value.Station;
    this.invoiceService.saveInvoice(this.invoiceModel).subscribe((res: any) => {
      console.log('====================res for invoice', res)
      if(res.status) {
        let invoiceId = res.data[0].InvoiceId;
        if(invoiceId != 0 ) {
          let j;
          let DetailfieldArray = [];
          for(j=0; j < this.fieldArray.length; j++) {
            var invoiceDetails = {
              "InvoiceId": invoiceId,
              "ProductId": this.fieldArray[j].ProductId,
              "Rate": this.fieldArray[j].Rate,
              "Quantity": this.fieldArray[j].Quantity,
              "Amount": this.fieldArray[j].Amount,
              // "AmountInINR": this.fieldArray[j].Amount*CurrencyValue,
              // "CreatedBy": userId,
              // "ModifiedBy": userId,
              // "ItemDescription": this.fieldArray[j].ItemDescription,
            }
            DetailfieldArray.push(invoiceDetails);
          }
          this.invoiceService.saveInvoiceDetail(DetailfieldArray).subscribe((response: any) => {
            console.log('====================res for invoice details', response)
            if(response.status) {
              this.toastr.success('Invoice and Invoice Details are added Successfully!');
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

    // this.invoiceModel.CustomerId = this.customerId;
    
    // this.invoiceModel.InvoiceAmountInINR = CurrencyValue * this.InvoiceAmount;
    // this.invoiceModel.CurrencyRate = CurrencyValue;
    // debugger;
    // this.invoiceModel.ProjectId = this.projectId;
    // this.invoiceModel.CreatedBy = parseInt(userId);
    // this.invoiceModel.ModifiedBy = parseInt(userId);
    // console.log('=================this.invoice Model', this.invoiceModel);
    // // this.invoiceModel.InvoiceAmountInINR
    // // this.invoiceModel.CurrencyRate
    // console.log('==========================test amount', this.InvoiceAmount, this.milestoneCost);
    // let a: number = parseInt(this.milestoneCost);
    // let b: number = parseInt(this.InvoiceAmount);
    // if(this.changeAddForm == false) {
    //   if(a!=b) {
    //     console.log('=============aaaaaaaaaabbbbbbbbbb', a, b);
    //     this.toastr.error('Total Invoices Amount is not matching to the Milestone Budget.', 'Please Adjust Invoice Amount');
    //   } else {
    //     console.log('=================this.invoice Model', this.invoiceModel);
  
    //     this.invoiceService.saveInvoice(this.invoiceModel).subscribe(async (res: any) => {
    //       console.log("invoice save",res);
    //       this.InvoiceId = res.data[0].InvoiceId;
    //       let j;
          
    //       for (j = 0; j < this.fieldArray.length; j++){
            
    //         var IDetailsObject = {
    //           "InvoiceId": this.InvoiceId,
    //           "MilestoneId": this.milestoneId,
    //           "ResourceId": this.fieldArray[j].EmployeeId,
    //           "Rate": this.fieldArray[j].Rate,
    //           "Quantity": this.fieldArray[j].Quantity,
    //           "Amount": this.fieldArray[j].Amount,
    //           "CreatedBy": userId,
    //           "ModifiedBy": userId,
    //           "ItemDescription": this.fieldArray[j].ItemDescription,
    //         }
    //         this.DetailfieldArray.push(IDetailsObject);
    //       }
    //       console.log('=======================array for invoice detail', this.DetailfieldArray);
    //       // debugger;
    //       this.invoiceService.saveInvoiceDetails(this.DetailfieldArray).subscribe(async (res: any) => {
    //         console.log("invoice details save",res);
    //         if(res.status) {
    //           this.dialogRef.close();
    //           this.toastr.success('Invoice and Invoice Details saved successfully.', 'Success');
    //         }
    //       })
    //     })
  
    //   }
    // } else {
    //   console.log('=================this.invoice Model', this.invoiceModel);
    //   this.invoiceService.saveInvoice(this.invoiceModel).subscribe(async (res: any) => {
    //     console.log("invoice save",res);
    //     this.InvoiceId = res.data[0].InvoiceId;
    //     let j;
        
    //     for (j = 0; j < this.fieldArray.length; j++){
          
    //       var IDetailsObject = {
    //         "InvoiceId": this.InvoiceId,
    //         "MilestoneId": 0,
    //         "ResourceId": 0,
    //         "Rate": this.fieldArray[j].Rate,
    //         "Quantity": this.fieldArray[j].Quantity,
    //         "Amount": this.fieldArray[j].Amount,
    //         "AmountInINR": this.fieldArray[j].Amount*CurrencyValue,
    //         "CreatedBy": userId,
    //         "ModifiedBy": userId,
    //         "ItemDescription": this.fieldArray[j].ItemDescription,
    //       }
    //       this.DetailfieldArray.push(IDetailsObject);
    //     }
    //     console.log('=======================array for invoice detail', this.DetailfieldArray);
    //     // debugger;
    //     this.invoiceService.saveInvoiceDetails(this.DetailfieldArray).subscribe(async (res: any) => {
    //       console.log("invoice details save",res);
    //       if(res.status) {
    //         this.dialogRef.close();
    //         this.toastr.success('Invoice and Invoice Details saved successfully.', 'Success');
    //       }
    //     })
    //   })
    // }
  }

  closeDialog() {
    // this.dialogRef.close();
  }

}
