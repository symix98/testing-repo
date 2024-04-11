import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTakeoffRoutingModule } from '../../../../core/modules/routing/mat-takeoff-routing.module';
import { MaterialTakeoffFormComponent } from './components/material-takeoff-form/material-takeoff-form.component';
import { MatTakeoffFormsComponent } from './mat-takeoff-forms/mat-takeoff-forms.component';
import { MatTakeoffListComponent } from './mat-takeoff-list/mat-takeoff-list.component';
import { SharedModule } from 'src/app/core/modules/shared.module';


@NgModule({
  declarations: [
    MaterialTakeoffFormComponent,
        MatTakeoffFormsComponent,
        MatTakeoffListComponent,
  ],
  imports: [
    CommonModule,
    MatTakeoffRoutingModule,
    SharedModule
  ],
  exports: [
    MatTakeoffListComponent
  ]
})
export class MatTakeoffModule {
 }
