import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerModel } from '../../../Models/customer.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../Services/customer.service';
import { AppService } from '../../../Services/app-service.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  @Input() name: any;
  countryList: any;

  customerModel: CustomerModel = new CustomerModel();
  createForm: any = FormGroup;
  stateList: Array<any> = [];
  cityList: Array<any> = [];
  showGst = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private appService: AppService
  ) {
    this.customerModel.IsActive = false;
    this.createForm = this.fb.group({
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
      // GstNumber: [''],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Country: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.appService.getCountryList().subscribe((data: any) => {
      if (!!data && data.data) {
        this.countryList = data.data;
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
    console.log(CountryId)
    if(CountryId === 101) {
      console.log('==========================true for india')
      this.createForm.addControl('GstNumber', this.fb.control('', [Validators.required]));
      this.showGst = true;
    } else {
      console.log('false=======================')
      this.createForm.removeControl('GstNumber');
      this.showGst = false;
    }
    this.customerModel.Country = CountryId;
    // this.customerModel.State = null;
    // this.customerModel.City = null;
    this.stateList = [];
    if (!!this.customerModel.Country) {
      this.appService.getStateListByCountryId(this.customerModel.Country)
      .subscribe((data: any) => {
          console.log("state "+JSON.stringify(data))
          if (!!data && data.data) {
              this.stateList = data.data;
          }
      });
    }
  }

  getCityList(StateId: any) {
    this.customerModel.State = StateId;
    // this.customerModel.CityId = null;
    this.cityList = [];
    if (!!this.customerModel.State) {
      this.appService.getCityListByStateId(this.customerModel.State)
      .subscribe((data: any) => {
          if (!!data && data.data) {
              this.cityList = data.data;
          }
      });
    }
  }

  goBack() {
    this.router.navigateByUrl("dashboard/customers");
  }

  onSubmit() {
    console.log("createForm "+JSON.stringify(this.createForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.customerModel.CreatedBy = parseInt(userId);
      this.customerModel.ModifiedBy = parseInt(userId);
      this.customerModel.CreatedDate = new Date();
      this.customerModel.ModifiedDate = new Date();
    }
    this.customerModel.IsDeleted = false;
    this.insertCustomerdata();
  }

  insertCustomerdata = () => {

    console.log( this.customerModel)
    this.customerModel.FirstName = this.createForm.value.Firstname;
    this.customerModel.LastName = this.createForm.value.LastName;
    this.customerModel.Email = this.createForm.value.Email;
    this.customerModel.MobileNumber = this.createForm.value.MobileNumber;
    this.customerModel.PhoneNumber = this.createForm.value.PhoneNumber;
    this.customerModel.PostalCode = this.createForm.value.PostalCode;
    this.customerModel.City = this.createForm.value.City;
    this.customerModel.State = this.createForm.value.State;
    this.customerModel.Country = this.createForm.value.Country;
    this.customerModel.GstNumber = this.createForm?.value.GstNumber;
    console.log('==cus', this.customerModel);
    this.customerService.saveCustomer(this.customerModel).subscribe((data: any) => {
      if (!!data) {
        if (data.IsExist) {
          this.toastr.error("Email or Mobile Number is already exist in system.", "", { timeOut: 25000 })
        } else {
          this.toastr.success('Customer has been Added successfully', 'Success');
          this.router.navigateByUrl("dashboard/customers");
        }
      } else {
        this.toastr.error("Something Wrong!", "Error");
      }

    });
  }

}

