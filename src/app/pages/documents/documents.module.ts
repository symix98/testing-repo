import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentsRoutingModule } from 'src/app/core/modules/routing/documents-routing.module';
import { SharedModule } from 'src/app/core/modules/shared.module';



@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DocumentsRoutingModule
  ]
})
export class DocumentsModule { }
