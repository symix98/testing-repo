import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentMultiplepropertiesComponent } from 'src/app/pages/document-form-wizzard/document-multipleproperties/document-multipleproperties.component';
import { DocumentNumbering } from 'src/app/pages/document-form-wizzard/document-numbering/document-numbering.component';
import { DocumentProperties } from 'src/app/pages/document-form-wizzard/document-properties/document-properties.component';
import { DocumentUploadComponent } from 'src/app/pages/document-form-wizzard/document-upload/document-upload.component';
import { DocumentTrackComponent } from 'src/app/pages/document-management/components/document-track/document-track.component';
import { EditDocumentComponent } from 'src/app/pages/document-management/components/edit-document/edit-document.component';
import { RegisterTransmittalComponent } from 'src/app/pages/document-management/components/transmittal/register-transmittal/register-transmittal.component';
import { InboxTransmittalComponent } from 'src/app/pages/document-management/components/transmittal/inbox-transmittal/inbox-transmittal.component';
import { TransmittalComponent } from 'src/app/pages/document-management/components/transmittal/transmittal.component';
import { TransmittalsListComponent } from 'src/app/pages/document-management/components/transmittal/transmittals-list/transmittals-list.component';
import { DocumentManagementComponent } from 'src/app/pages/document-management/document-management.component';
import { LibraryViewComponent } from 'src/app/pages/document-management/library-view/library-view.component';

const routes: Routes = [
  { path: '', component: DocumentManagementComponent, children:
  [ 
    { path: 'libraries', component: LibraryViewComponent,children:[
      { path: 'document-upload', component: DocumentUploadComponent } ,
      { path: 'document-numbering', component: DocumentNumbering } ,
      { path: 'document-properties', component: DocumentProperties },
      { path: 'document-multiple', component: DocumentMultiplepropertiesComponent },
    ] } ,
   
    { path: 'edit-document', component: EditDocumentComponent },
    { path: 'transmittal', component: TransmittalComponent },
    { path: 'register-transmittal', component: RegisterTransmittalComponent },
    { path: 'inbox-transmittal', component: InboxTransmittalComponent },
    { path: 'document-track', component: DocumentTrackComponent },
    
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ]},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
