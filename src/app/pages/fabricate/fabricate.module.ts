import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FabricateComponent } from './fabricate.component';
import { FabListComponent } from './fab-list/fab-list.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { FabTrackerComponent } from './fab-tracker/fab-tracker.component';
import { FabricateRoutingModule } from '../../core/modules/routing/fabricate-routing.module';


@NgModule({
  declarations: [
    FabListComponent,
    FabricateComponent,
    FabTrackerComponent,
  ],
  imports: [
    CardModule,
    CommonModule,
    SharedModule,
    ButtonModule,
    ToolbarModule,
    DropdownModule,
    InputTextModule,
    FabricateRoutingModule,
  ],
})

export class FabricateModule { }
