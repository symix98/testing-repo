import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from 'src/app/pages/fabrication-management/support-forms/review/review.component';
import { SupportFormsComponent } from 'src/app/pages/fabrication-management/support-forms/support-forms.component';
import { FormListComponent } from 'src/app/pages/fabrication-management/support-forms/form-list/form-list.component';
import { FormTrackComponent } from 'src/app/pages/fabrication-management/support-forms/form-track/form-track.component';
import { RsfFormComponent } from 'src/app/pages/fabrication-management/support-forms/templates/rsf-form/rsf-form.component';
import { MyRequestsComponent } from 'src/app/pages/fabrication-management/support-forms/my-requests/my-requests.component';


const routes: Routes = [
  { path: '', component: SupportFormsComponent, children:
    [ 
      { path: 'rsf-form', component: RsfFormComponent } ,
      { path: 'form-track', component: FormTrackComponent },
      { path: 'request-list', component: MyRequestsComponent },
    ]
  },
  // { path: 'review', component: ReviewComponent },
  // { path: 'form-track', component: FormTrackComponent },
  // { path: 'inbox', component: FormListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SupportFormsRoutingModule {}
