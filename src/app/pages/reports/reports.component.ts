import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Report } from 'src/app/core/models/report.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {

  tabs: string[] = [];
  reports: Report[];
  subscriptions = new Subscription();

  constructor(private api: ApiService) {
    this.getReports();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getReports() {
    this.subscriptions.add(this.api.get(ApiURL.reports).subscribe((data) => {
      this.reports = data;
      this.tabs = [...new Set(this.reports.map(a => a.category))];
    }));
  }
}
