import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportFabricationModuleRoutingModule } from '../../../core/modules/routing/support-fabrication-module-routing.module';
import { SupportFabricationComponent } from '../Support-fabrication-module/support-fabrication-module.component';
import { SupportsComponent } from './supports/supports.component';
import { MatTakeoffComponent } from '../Engineering/mat-takeoff/mat-takeoff.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { SupportPictorialComponent } from '../Engineering/support-pictorial/support-pictorial.component';
import { SupportsDetailsFormComponent } from './supports/component/supports-details-form/supports-details-form.component';
import { MatTakeoffModule } from '../Engineering/mat-takeoff/mat-takeoff.module';
import { SupportStatusListComponent } from './supports/component/support-status-list/support-status-list.component';
import { SupportStatusFormComponent } from './supports/component/support-status-form/support-status-form.component';
import { GroupedSupportListComponent } from './supports/component/grouped-support-list/grouped-support-list.component';
import { SupportForcastComponent } from './support-forcast/support-forcast.component';

@NgModule({
  declarations: [
    SupportsComponent,
    SupportFabricationComponent,
    MatTakeoffComponent,
    SupportPictorialComponent,
    SupportsDetailsFormComponent,
    SupportStatusListComponent,
    SupportStatusFormComponent,
    GroupedSupportListComponent,
    SupportForcastComponent,

    
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTakeoffModule,
    SupportFabricationModuleRoutingModule
  ]
})
export class SupportFabricationModuleModule { }
