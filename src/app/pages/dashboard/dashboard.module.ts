import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from '../../core/modules/routing/dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AddComponent } from './directive/addComponent.directive';
import { LayoutComponent } from './layout/layout.component';
import { ComponentsMenuComponent } from './shared/components-menu/components-menu.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { InboxComponent } from './inbox/inbox.component';
import { InboxItemComponent } from './inbox/inbox-item/inbox-item.component';
import { WidgetInboxComponent } from './widgets/widget-inbox/widget-inbox.component';
import { WidgetComponent } from './shared/widget/widget.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { MyRequestsItemComponent } from './my-requests/my-requests-item/my-requests-item.component';
import { WidgetMyRequestsComponent } from './widgets/widget-my-requests/widget-my-requests.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    ComponentsMenuComponent,
    AddComponent,
    InboxComponent,
    InboxItemComponent,
    WidgetInboxComponent,
    WidgetComponent, 
    MyRequestsComponent,
    MyRequestsItemComponent,
    WidgetMyRequestsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
