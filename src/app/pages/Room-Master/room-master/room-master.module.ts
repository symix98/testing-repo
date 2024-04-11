import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomMasterRoutingModule } from '../../../core/modules/routing/room-master-routing.module';
import { RoomMasterComponent } from './room-master.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { DocumentFormWizzardModule } from '../../document-form-wizzard/document-form-wizzard.module';


@NgModule({
  declarations: [
    RoomMasterComponent
  ],
  imports: [
    CommonModule,
    RoomMasterRoutingModule,
    SharedModule,
    DocumentFormWizzardModule
  ]
})
export class RoomMasterModule { }
