import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingsModel } from 'src/app/Models/settings.model';
import { AppService } from 'src/app/Services/app-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: any = {};
  SettingsModel: SettingsModel = new SettingsModel();
  editForm: any = FormGroup;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      CgstPercent: ['', Validators.required],
      IgstPercent: ['', Validators.required],
      SgstPercent: ['', Validators.required],
      HSNNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.appService.getSettings().subscribe((res: any) => {
      if(res.status) {
        this.settings = res.data[0];
        this.SettingsModel.SettingsId = res.data[0].SettingsId;
        this.SettingsModel.CreatedBy = res.data[0].CreatedBy;
        this.editForm.get('CgstPercent').setValue(res.data[0].CgstPercent);
        this.editForm.get('IgstPercent').setValue(res.data[0].IgstPercent);
        this.editForm.get('SgstPercent').setValue(res.data[0].SgstPercent);
        this.editForm.get('HSNNumber').setValue(res.data[0].HSNNumber);
      }
    })
  }

  onSubmit() {
    console.log("editForm "+JSON.stringify(this.editForm.value));
    const userId = localStorage.getItem('UserId');
    if (!!userId) {
      this.SettingsModel.ModifiedBy = parseInt(userId);
    }
    this.updateSettings();
  }

  updateSettings() {
    this.SettingsModel.CgstPercent = this.editForm.value.CgstPercent;
    this.SettingsModel.IgstPercent = this.editForm.value.IgstPercent;
    this.SettingsModel.SgstPercent = this.editForm.value.SgstPercent;
    this.SettingsModel.HSNNumber = this.editForm.value.HSNNumber;
    this.appService.saveSettings(this.SettingsModel).subscribe((res: any) => {
      if (res.status) {
        this.toastr.success('Settings has been updated successfully', 'Success');
        this.router.navigateByUrl("dashboard");
      } else {
        this.toastr.error("Something Wrong!", "Error");
      }
    })
  }

  goBack() {
    this.router.navigateByUrl("dashboard");
  }

}
