import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../Services/app-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userDetails: any;
  userId: any;

  constructor(
    private appService: AppService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('UserId');
    this.getUserDetails();
  }

  getUserDetails() {
    this.appService.getVendorById(this.userId).subscribe((res: any) => {
      console.log('========================res', res)
      if(res.status) {
        this.userDetails = res.data[0];
      }
    })
  }

  gotoCustomers() {
    this.router.navigateByUrl('dashboard/customers');
  }

  gotoCategories() {
    this.router.navigateByUrl('dashboard/categories');
  }

  gotoProducts() {
    this.router.navigateByUrl('dashboard/products');
  }

  gotoInvoice() {
    this.router.navigateByUrl('dashboard/invoice');
  }

  gotoSettings() {
    this.router.navigateByUrl('dashboard/settings');
  }

  // gotoReports() {
  //   this.router.navigateByUrl('dashboard/reports');
  // }

  logout() {
    console.log('====================================logout')
    this.router.navigateByUrl('');
    localStorage.clear();
  }

}
