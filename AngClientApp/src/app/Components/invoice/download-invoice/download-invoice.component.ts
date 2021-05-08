import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from './../../../Services/invoice.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerService } from './../../../Services/customer.service';
import { PropertyBindingType } from '@angular/compiler';
import { AppService } from './../../../Services/app-service.service';
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss']
})
export class DownloadInvoiceComponent implements OnInit {

  invoiceDetails: any;
  invoiceDetailsByInvoiceId: any;
  invoiceId: any;
  customerId: any;
  customerDetails: any;
  numberInWords!: string;
  numberInWordstax: any;
  lang: SUPPORTED_LANGUAGE = 'en';
  value: any;
  vendorDetails: any;
  settings: any;
  showTax = '';
  no: Boolean = false;
  one: Boolean = false
  both: Boolean = false;


  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private appService: AppService,
    private ngxNumToWordsService: NgxNumToWordsService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('=======================params', params)
      this.invoiceId = params.id;
      this.customerId = params.cid
    })
    await this.getVendorById();
    await this.getCustomerById();
    await this.getSettings();
    await this.getInvoiceByInvoiceId();
    await this.getInvoiceDetailsByInvoiceId();
  }

  async getVendorById() {
    let id = localStorage.getItem('UserId');
    await this.appService.getVendorById(id).subscribe(async (res: any) => {
      if(res.status) {
        this.vendorDetails = await res.data[0];
        this.appService.getCountryByCountryId(this.vendorDetails.Country).subscribe((res: any) => {
          if(res.status) {
            this.vendorDetails.CountryName = res.data[0].CountryName
          }
        })
        this.appService.getStateByStateId(this.vendorDetails.State).subscribe((res: any) => {
          if(res.status) {
            this.vendorDetails.StateName = res.data[0].StateName
          }
        })
        this.appService.getCityByCityId(this.vendorDetails.City).subscribe((res: any) => {
          if(res.status) {
            this.vendorDetails.CityName = res.data[0].CityName
          }
        })
      }
    })
  }

  getInvoiceByInvoiceId() {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe((res: any) => {
      if(res.status) {
        this.invoiceDetails = res.data[0];
        setTimeout(() => { 
          if(this.customerDetails?.Country != 101) {
            this.no = true;
            console.log('=======cust out of ind')
            this.invoiceDetails.Tax = 0;
            this.showTax = 'No Tax : '
            let tax = 0;
            this.invoiceDetails.Tax = 0;
            this.numberInWordstax = this.ngxNumToWordsService.inWords(tax, this.lang);
          } else {
            if(this.customerDetails.State === this.vendorDetails.State) {
              this.both = true;
              console.log('============cust and vend state is same cgst, sgst')
              let tax = this.settings.CgstPercent + this.settings.SgstPercent
              let c = this.settings.CgstPercent;
              let s = this.settings.SgstPercent
              this.invoiceDetails.TaxC = (this.invoiceDetails.TotalAmount* c)/100;
              this.invoiceDetails.TaxS = (this.invoiceDetails.TotalAmount* s)/100;
              this.invoiceDetails.Tax = (this.invoiceDetails.TotalAmount*tax)/100;
              this.showTax = 'Add Tax           @CGST : ' + this.settings.CgstPercent + '%  + @SGST : ' + this.settings.SgstPercent + '%'
              this.numberInWordstax = this.ngxNumToWordsService.inWords(tax, this.lang);
            } else {
              this.one = true;
              let tax = this.settings.IgstPercent
              console.log('============cust and vend state is diff igst', this.invoiceDetails.TotalAmount, tax)
              this.invoiceDetails.Tax = (this.invoiceDetails.TotalAmount*tax)/100;
              this.showTax = 'Add Tax           @IGST : ' + this.settings.IgstPercent +'%'
              this.numberInWordstax = this.ngxNumToWordsService.inWords(tax, this.lang)
            }
          }
          this.invoiceDetails.TotalInvoiceAmount = this.invoiceDetails.TotalAmount + this.invoiceDetails.Tax;
          this.value = this.invoiceDetails.TotalInvoiceAmount;
          // let z=this.value;
          // var x = z.split('.');
          // console.log('=============xxxxxxxxxx',z, x)
          this.numberInWords = this.ngxNumToWordsService.inWords(this.value, this.lang);
        }, 2000);
      }
    })
  }

  getInvoiceDetailsByInvoiceId() {
    this.invoiceService.getInvoiceDetailsByInvoiceId(this.invoiceId).subscribe((res: any) => {
      console.log('=================data', res);
      if(res.status) {
        this.invoiceDetailsByInvoiceId = res.data;
      }
    })
  }

  async getCustomerById() {
    await this.customerService.getCustomerById(this.customerId).subscribe(async (res: any) => {
      if(res.status) {
        this.customerDetails = await res.data[0];
        let countryId = res.data[0].Country;
        this.appService.getCountryByCountryId(countryId).subscribe((res: any) => {
          if(res.status) {
            this.customerDetails.CountryName = res.data[0].CountryName;
          }
        })
        let StateId = res.data[0].State;
        this.appService.getStateByStateId(StateId).subscribe((res: any) => {
          if(res.status) {
            this.customerDetails.StateName = res.data[0].StateName;
          }
        })
        let CityId = res.data[0].City;
        this.appService.getCityByCityId(CityId).subscribe((res: any) => {
          if(res.status) {
            this.customerDetails.CityName = res.data[0].CityName;
          }
        })
      }
    })
  }

  getSettings() {
    this.appService.getSettings().subscribe((res: any) => {
      if(res.status) {
        this.settings = res.data[0];
      }
    })
  }

  openPDF() {
    var element: any = document.getElementById('htmlData')

    html2canvas(element).then((canvas: any) => {
      var imageData = canvas.toDataURL('image/png')
      var doc = new jsPDF()
      var imageHeight = canvas.height * 208 / canvas.width ;
      doc.addImage(imageData, 0, 0, 208, imageHeight)
      doc.save('invoice.pdf');
    })
  }

}
