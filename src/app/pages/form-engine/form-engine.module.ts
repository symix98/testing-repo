import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormEngineRoutingModule } from './form-engine-routing.module';
import { FormEngineComponent } from './form-engine.component';
import { SharedModule } from 'src/app/core/modules/shared.module';


@NgModule({
  declarations: [
    FormEngineComponent
  ],
  imports: [
    CommonModule,
    FormEngineRoutingModule,
    SharedModule
  ]
})
export class FormEngineModule { }
