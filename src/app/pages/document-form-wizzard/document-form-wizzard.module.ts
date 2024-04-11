import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentFormWizzardRoutingModule } from '../../core/modules/routing/document-form-wizzard-routing.module';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { DocumentFormWizzardComponent } from './document-form-wizzard.component';
import { DocumentNumbering } from './document-numbering/document-numbering.component';
import { DocumentProperties } from './document-properties/document-properties.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentMultiplepropertiesComponent } from './document-multipleproperties/document-multipleproperties.component';


@NgModule({
  declarations: [
    DocumentFormWizzardComponent,
    DocumentUploadComponent,
    DocumentNumbering,
    DocumentProperties,
    DocumentMultiplepropertiesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DocumentFormWizzardRoutingModule
  ]
})
export class DocumentFormWizzardModule { }
