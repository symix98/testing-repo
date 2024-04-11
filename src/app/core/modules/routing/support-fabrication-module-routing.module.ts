import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportFabricationComponent } from 'src/app/pages/fabrication-management/Support-fabrication-module/support-fabrication-module.component';
import { SupportPictorialComponent } from 'src/app/pages/fabrication-management/Engineering/support-pictorial/support-pictorial.component';
import { SupportsComponent } from 'src/app/pages/fabrication-management/Support-fabrication-module/supports/supports.component';
import { MatTakeoffComponent } from 'src/app/pages/fabrication-management/Engineering/mat-takeoff/mat-takeoff.component';
import { MaterialTakeoffFormComponent } from 'src/app/pages/fabrication-management/Engineering/mat-takeoff/components/material-takeoff-form/material-takeoff-form.component';
import { SupportsDetailsFormComponent } from 'src/app/pages/fabrication-management/Support-fabrication-module/supports/component/supports-details-form/supports-details-form.component';
import { SupportForcastComponent } from 'src/app/pages/fabrication-management/Support-fabrication-module/support-forcast/support-forcast.component';

const routes: Routes = [
  {
    path: '', component: SupportFabricationComponent, children: [
      { path: 'supports', component: SupportsComponent },
      { path: 'supports-forecast', component: SupportForcastComponent },
      { path: 'supports-detail', component: SupportsDetailsFormComponent },
      { path: 'digital-pictorial', component: SupportPictorialComponent },
      // { path: 'mto-lookup', component: MatTakeoffComponent},
      // { path: 'mto-form', component: MaterialTakeoffFormComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SupportFabricationModuleRoutingModule { }
