import { TableTemplateComponent } from '../../pages/shared/table-template/table-template.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from './primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapPipePipe } from '../pipes/map-pipe.pipe';
import { ListViewComponent } from 'src/app/pages/shared/list-view/list-view.component';
import { DataViewComponent } from 'src/app/pages/shared/data-view/data-view.component';
import { UserProfileComponent } from 'src/app/pages/shared/user-profile/user-profile.component';
import { SigningPadComponent } from 'src/app/pages/shared/signing-pad/signing-pad.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ProductsDataviewComponent } from 'src/app/pages/shared/products-dataview/products-dataview.component';
import { CustomCollapseComponent } from 'src/app/pages/shared/custom-collapse/custom-collapse.component';

@NgModule({
  declarations: [
    TableTemplateComponent,
    ProductsDataviewComponent,
    MapPipePipe,
    ListViewComponent,
    DataViewComponent,
    SigningPadComponent,
    UserProfileComponent,
    CustomCollapseComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    SignaturePadModule
  ],
  exports: [
    TableTemplateComponent,
    ProductsDataviewComponent,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    SigningPadComponent,
    MapPipePipe,
    ListViewComponent,
    DataViewComponent,
    UserProfileComponent,
    CustomCollapseComponent
  ]
})
export class SharedModule { }
