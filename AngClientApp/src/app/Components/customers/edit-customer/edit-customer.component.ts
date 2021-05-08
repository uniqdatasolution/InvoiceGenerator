import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerModel } from '../../../Models/customer.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../Services/customer.service';
import { AppService } from '../../../Services/app-service.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {

  @Input() name: any;
  countryList: any;
  id: any;
  toggleStatus: boolean = false;
  customerModel: CustomerModel = new CustomerModel();
  editForm: any = FormGroup;
  stateList: Array<any> = [];
  cityList: Array<any> = [];
  currencyList: Array<any> = [];
  showGst = false;
  customerDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private appService: AppService
  ) {
    this.editForm = this.fb.group({
      Firstname: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      MobileNumber: ['', 
        Validators.compose([
          Validators.required, 
          Validators.pattern('^([0|\+[0-9]{1,3})?([0-9][0-9]{9})$')
        ])
      ],
      PhoneNumber: [''],
      PostalCode: ['', 
        Validators.compose([
          Validators.required,
          Validators.pattern('^([0-9]){6}$')
        ])
      ],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      // AadharCard:  ['', Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')],
      // PanCard: ['', Validators.pattern('^([A-Z]){5}([0-9]){4}([A-Z]){1}$')],
      // GstNumber: [''],
      CurrencyCode: ['', Validators.required]
    });
    this.editForm.controls['Email'].disable();
  }

  ngOnInit(): void {
    this.getCurrencyList();
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.customerService.getCustomerById(this.id).subscribe((data: any) => {
          console.log("data "+JSON.stringify(data))
          data = data.data[0]
          this.customerDetails= data
          this.customerModel.CustomerId = data.CustomerId;
          this.customerModel.IsActive = data.IsActive;
          this.customerModel.IsDeleted = data.IsDeleted;
          this.customerModel.CreatedBy = data.CreatedBy;
          this.customerModel.CreatedDate = data.CreatedDate;
          this.customerModel.Email = data.Email;
          this.toggleStatus = data.IsActive;
          this.editForm.get('Firstname').setValue(data.FirstName);
          this.editForm.get('LastName').setValue(data.LastName);
          this.editForm.get('Email').setValue(data.Email);
          this.editForm.get('MobileNumber').setValue(data.MobileNumber);
          this.editForm.get('PhoneNumber').setValue(data.PhoneNumber);
          this.editForm.get('PostalCode').setValue(data.PostalCode);
          this.editForm.get('Country').setValue(data.Country);
          // this.editForm.get('GstNumber').setValue(data.GstNumber);
          // this.editForm.get('CurrencyCode').setValue(data.CurrencyCode);
          // this.editForm.get('State').setValue(data.StateId);
          // this.editForm.get('City').setValue(data.CityId);
          // this.editForm.get('Country').setValue(data.Country);

          this.getStateList(data.Country);
          // this.editForm.get('State').setValue(data.State);
          this.getCityList(data.State);
          this.editForm.get('City').setValue(data.City);
          this.editForm.get('CurrencyCode').setValue(data.CurrencyCode);
          this.editForm.get('GstNumber').setValue(data.GstNumber);
      })
    }) 
    this.appService.getCountryList().subscribe((data: any) => {
      if (!!data && data.data) {
        this.countryList = data.data;
      }
    })
  }

  getCurrencyList() {
    this.appService.getCurrencyList().subscribe((res: any) => {
      console.log('=====================list', res.data)
      if(res.status) {
        this.currencyList=res.data;
      }
    })
  }

  setValue(e: any){
    console.log("event "+ JSON.stringify(e.checked))
    if(e.checked){
      this.customerModel.IsActive = true
    }else{
      this.customerModel.IsActive = false
    }
  }

  getStateList(CountryId: any) {
    console.log('countryId================================', CountryId)
    if(CountryId === 101) {
      console.log('==========================true for india')
      this.editForm.addControl('GstNumber', this.fb.control('', [Validators.required]));
      this.showGst = true;
    } else {
      console.log('false=======================')
      this.editForm.removeControl('GstNumber');
      this.showGst = false;
    }
    this.customerModel.Country = CountryId;
    this.stateList = [];
    if (!!this.customerModel.Country) {
      this.appService.getStateListByCountryId(this.customerModel.Country)
      .subscribe((data: any) => {
          console.log("state "+JSON.stringify(data))
          if (!!data && data.data) {
              this.stateList = data.data;
              this.editForm.get('State').setValue(this.customerDetails.State);
              this.getCityList(this.customerDetails.State)
          }
      });
    }
  }

  getCityList(StateId: any) {
    console.log('StateId================================', StateId)
    this.customerModel.State = StateId;
    this.cityList = [];
    if (!!this.customerModel.State) {
      this.appService.getCityListByStateId(this.customerModel.State)
      .subscribe((data: any) => {
          if (!!data && data.data) {
              this.cityList = data.data;
              this.editForm.get('City').setValue(this.customerDetails.City);
          }
      });
    }
  }

  goBack() {
    this.router.navigateByUrl("dashboard/customers");
  }

  onSubmit() {
    console.log("editForm "+JSON.stringify(this.editForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.customerModel.ModifiedBy = parseInt(userId);
      this.customerModel.ModifiedDate = new Date();
    }
    this.updateCustomerdata();
  }

  updateCustomerdata() {
    console.log('===================', this.customerModel)
    this.customerModel.FirstName = this.editForm.value.Firstname;
    this.customerModel.LastName = this.editForm.value.LastName;
    this.customerModel.MobileNumber = this.editForm.value.MobileNumber;
    this.customerModel.PhoneNumber = this.editForm.value.PhoneNumber;
    this.customerModel.PostalCode = this.editForm.value.PostalCode;
    this.customerModel.City = this.editForm.value.City;
    this.customerModel.State = this.editForm.value.State;
    this.customerModel.Country = this.editForm.value.Country;
    this.customerModel.GstNumber = this.editForm?.value.GstNumber;
    this.customerModel.CurrencyCode = this.editForm?.value.CurrencyCode;
    console.log('==cus', this.customerModel);
    this.customerService.saveCustomer(this.customerModel).subscribe((data: any) => {
      if (data.status) {
        this.toastr.success('Customer has been Edited successfully', 'Success');
        this.router.navigateByUrl("dashboard/customers");
      } else {
        this.toastr.error("Something Wrong!", "Error");
      }
    });
  }

}
