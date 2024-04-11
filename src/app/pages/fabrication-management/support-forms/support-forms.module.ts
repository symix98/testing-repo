import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review/review.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { SupportFormsComponent } from './support-forms.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormTrackComponent } from './form-track/form-track.component';
import { RsfFormComponent } from './templates/rsf-form/rsf-form.component';
import { FormReviewComponent } from './form-track/form-review/form-review.component';
import { FabTrackerComponent } from '../../fabricate/fab-tracker/fab-tracker.component'
import { FormTimelineComponent } from './form-track/form-timeline/form-timeline.component';
import { SupportFormsRoutingModule } from '../../../core/modules/routing/support-forms-routing.module';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { RsfSupportListComponent } from './templates/rsf-form/components/rsf-support-list/rsf-support-list.component';
import { RsfSupportsTableComponent } from './templates/rsf-form/components/rsf-supports-table/rsf-supports-table.component';
import { RsfAssignComponent } from './rsf-assign/rsf-assign.component';
import { RsfReviseComponent } from './rsf-revise/rsf-revise.component';


@NgModule({
  declarations: [
    SupportFormsComponent,
    RsfFormComponent,
    FormListComponent,
    ReviewComponent,
    FormTrackComponent,
    FormReviewComponent,
    FormTimelineComponent,
    MyRequestsComponent,
    RsfSupportListComponent,
    RsfSupportsTableComponent,
    RsfAssignComponent,
    RsfReviseComponent,
  ],
  imports: [
    CommonModule,
    SupportFormsRoutingModule,
    SharedModule,
  ],
  exports: [
    FormListComponent,
  ]
})

export class SupportFormsModule { }
