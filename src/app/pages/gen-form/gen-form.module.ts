import { NgModule } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenFormComponent } from './gen-form.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { WorkFlowListComponent } from './work-flow-list/work-flow-list.component';
import { GenFormRoutingModule } from 'src/app/core/modules/routing/gen-form-routing.module';
import { AddWorkFlowStepComponent } from './add-work-flow-step/add-work-flow-step.component';


@NgModule({
  declarations: [
    GenFormComponent,
    WorkFlowListComponent,
    AddWorkFlowStepComponent,
  ],
  imports: [
    TreeModule,
    FormsModule,
    CommonModule,
    SharedModule,
    GenFormRoutingModule,
  ],
})

export class GenFormModule { }
