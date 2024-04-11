import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTakeoffFormsComponent } from 'src/app/pages/fabrication-management/Engineering/mat-takeoff/mat-takeoff-forms/mat-takeoff-forms.component';
import { MatTakeoffListComponent } from 'src/app/pages/fabrication-management/Engineering/mat-takeoff/mat-takeoff-list/mat-takeoff-list.component';
import { MatTakeoffComponent } from 'src/app/pages/fabrication-management/Engineering/mat-takeoff/mat-takeoff.component';

const routes: Routes = [{
  path: '', component: MatTakeoffComponent, children: [
    { path: 'mto-list', component: MatTakeoffListComponent },
    { path: 'mto-form', component: MatTakeoffFormsComponent },
  ]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatTakeoffRoutingModule { }
