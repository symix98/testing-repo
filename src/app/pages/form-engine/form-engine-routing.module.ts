import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEngineComponent } from './form-engine.component';

const routes: Routes = [
  {path:'',component:FormEngineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormEngineRoutingModule { }
