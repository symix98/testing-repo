import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenFormComponent } from 'src/app/pages/gen-form/gen-form.component';
import { WorkFlowListComponent } from 'src/app/pages/gen-form/work-flow-list/work-flow-list.component';
import { AddWorkFlowStepComponent } from 'src/app/pages/gen-form/add-work-flow-step/add-work-flow-step.component';


const routes: Routes = [
    { path: '', component: GenFormComponent },
    { path: 'work-flow-list', component: WorkFlowListComponent },
    { path: 'add-flow-step', component:  AddWorkFlowStepComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GenFormRoutingModule { }
