import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AppService } from '../../Services/app-service.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: any;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'UserName': ['', Validators.required],
      'Password': ['', Validators.required],
    });
  }

  onSubmit(val: any) {
    // this.post = post;
    console.log('================val', val);
    this.appService.validateUser(val).subscribe((res: any) => {
      console.log('==================res of validate user', res);
      if(res.status) {
        if(res.data.length > 0) {
          this.toastr.success('Successfully LoggedIn.');
          // this.toastr.success('Hello world!', 'Toastr fun!');
          localStorage.setItem('token', res.token); 
          localStorage.setItem('UserId', res.data[0].VendorId);
          this.route.navigateByUrl('dashboard');
        } else {
          this.toastr.error('User Name or Password is Invalid.');
          // this.toastr.success('Hello world!', 'Toastr fun!');
        }
      } else {
        this.toastr.error('Something went wrong!');
        // this.toastr.success('Hello world!', 'Toastr fun!');
      }
    })
  }

}
