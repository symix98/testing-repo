import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { Report } from 'src/app/core/models/report.model';
import { ReportDetail } from 'src/app/core/models/report-detail.model';
import { ReportParamType } from 'src/app/core/miscellaneous/report-param-type';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  report: Report;
  reportDetails: ReportDetail[];
  reportParamType = ReportParamType;

  pdf: any;
  
  reportForm: FormGroup;

  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private dateService: DateService,
    private api: ApiService
  ) {
    this.getRouteParams();
    this.initForm();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm() {
    this.reportForm = this.fb.group([]);
  }

  getRouteParams() {
    this.subscriptions.add(this.route.paramMap.subscribe((params) => {
      this.getReport(+params.get('id'));
    }));
  }

  getReport(id: number) {
    this.subscriptions.add(this.api.get(`${ApiURL.reports}/${id}`).subscribe((data) => {
      this.report = data;
      this.getReportDetail();
    }));
  }

  getReportDetail() {
    let query: ApiQuery = new ApiQuery();
    let map = new Map<string, number>();
    map.set('reportId', this.report.id);
    query.filter = map;
    query.sort = ['order'];
    this.subscriptions.add(this.api.get(ApiURL.report_details, query).subscribe((data: ReportDetail[]) => {
      for (let detail of data) {
        let validator = detail.mandatory ? Validators.required : [];
        this.reportForm.addControl(detail.paramName, new FormControl(null, validator));
      }
      this.reportForm.updateValueAndValidity();
      this.reportDetails = data;
    }));
  }

  back() {
    const location: any = this.location.getState();
    if (location && location.navigationId > 1) {
      this.location.back();
    }
    else if (location && location.navigationId <= 1) {
      this.router.navigate(['']);
    }
    else {
      this.router.navigate(['']);
    }
  }

  getReportView() {
    this.loading = true;

    let param: any = {};

    for (let detail of this.reportDetails) {
      const value = this.reportForm.get(detail.paramName).value;

      switch (detail.paramType) {
        case this.reportParamType.date: {
          param[detail.paramName] = this.dateService.systemDateFormat(value);
          break;
        }
        default: {
          param[detail.paramName] = value;
          break;
        }
      }
    }

    this.subscriptions.add(this.api.getFile(`${ApiURL.report}/${this.report.name}/pdf`, param).subscribe(async (data: any) => {
      const file = new Blob([data], { type: 'application/pdf' });
      const winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,resizable,screenX=50,screenY=50,width=850,height=1050';
      //const base64 = await this.pdfService.fileToBase64(file);
      const base64 = "";
      const htmlPop = `<embed width=100% height=100%  type="application/pdf" src="${base64}"></embed>`;
      var printWindow = window.open("", `${this.report.description}`, winparams);
      printWindow.document.write(htmlPop);
      this.loading = false;
    }));
  }
}
