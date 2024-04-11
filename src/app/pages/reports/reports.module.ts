import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from 'src/app/core/modules/routing/reports-routing.module';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { ReportsComponent } from './reports.component';
import { ReportComponent } from './report/report.component';


@NgModule({
  declarations: [
    ReportsComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
