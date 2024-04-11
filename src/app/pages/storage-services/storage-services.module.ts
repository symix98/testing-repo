import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './storage-services.component';
import { ServicesRoutingModule } from 'src/app/core/modules/routing/services-routing.module';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { StorageServicesFormComponent } from './storage-serivces-form/storage-services-form/storage-services-form.component';
import { StorageServicesFormFieldsComponent } from './storage-serivces-form/storage-services-form-fields/storage-services-form-fields.component';



@NgModule({
  declarations: [
    ServicesComponent,
    StorageServicesFormComponent,
    StorageServicesFormFieldsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
