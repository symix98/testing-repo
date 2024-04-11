import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageServicesFormComponent } from 'src/app/pages/storage-services/storage-serivces-form/storage-services-form/storage-services-form.component';
import { ServicesComponent } from 'src/app/pages/storage-services/storage-services.component'

const routes: Routes = [
  { path: '', component: ServicesComponent },
  { path: 'create', component: StorageServicesFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
