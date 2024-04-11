import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FabricateComponent } from 'src/app/pages/fabricate/fabricate.component';
import { FabListComponent } from 'src/app/pages/fabricate/fab-list/fab-list.component';
import { FabTrackerComponent } from 'src/app/pages/fabricate/fab-tracker/fab-tracker.component';


const routes: Routes = [
  { path: '', component: FabricateComponent },
  { path: 'fab-list', component: FabListComponent },
  { path: 'fab-tracker', component: FabTrackerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FabricateRoutingModule { }
