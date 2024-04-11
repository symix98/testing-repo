import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedPageComponent } from 'src/app/pages/main/access-denied-page/access-denied-page.component';
import { ErrorPageComponent } from 'src/app/pages/main/error-page/error-page.component';
import { MainComponent } from 'src/app/pages/main/main.component';
import { NotFoundPageComponent } from 'src/app/pages/main/not-found-page/not-found-page.component';
import { KeycloakGuard } from '../../auth/keycloak.guard';
import { MaterialsTakeoffComponent } from 'src/app/pages/materials-takeoff/materials-takeoff.component';
import { MtoViewComponent } from 'src/app/pages/materials-takeoff/mto-view/mto-view.component';
import { DocumentFilterComponent } from 'src/app/pages/document-filter/document-filter.component';
import { LibraryViewComponent } from 'src/app/pages/document-management/library-view/library-view.component';
import { SharedDocPreviewComponent } from 'src/app/pages/document-management/hyperlink/shared-doc-preview/shared-doc-preview.component';
import { RoleGroupsComponent } from 'src/app/pages/settings/role-groups/role-groups.component';
import { RoomMasterComponent } from 'src/app/pages/Room-Master/room-master/room-master.component';

const routes: Routes = [
  { path: 'access', component: AccessDeniedPageComponent },
  
  {
    path: '', component: MainComponent, canActivate: [KeycloakGuard], children: [
      { path: 'viewDocs', component: SharedDocPreviewComponent },
      { path: '', loadChildren: () => import("../../../pages/dashboard/dashboard.module").then(m => m.DashboardModule) },
      { path: 'documents', loadChildren: () => import("../../../pages/document-management/document-management.module").then(m => m.DocumentManagementModule) },
      { path: 'room-master', loadChildren: () => import("../../../pages/Room-Master/room-master/room-master.module").then(m => m.RoomMasterModule) },
      { path: 'document-filter', component: DocumentFilterComponent}, 
      { path: 'dashboard', loadChildren: () => import("../../../pages/dashboard/dashboard.module").then(m => m.DashboardModule) },
      { path: 'fab-init', loadChildren: () => import("../../../pages/fabricate/fabricate.module").then(m => m.FabricateModule) },
      { path: 'gen-form', loadChildren: () => import("../../../pages/gen-form/gen-form.module").then(m => m.GenFormModule) },
      { path: 'services', loadChildren: () => import("../../../pages/storage-services/storage-services.module").then(m => m.ServicesModule) },
      { path: 'settings', loadChildren: () => import("../../../pages/settings/settings.module").then(m => m.SettingsModule) },
      { path: 'profile', loadChildren: () => import("../../../pages/shared/user-profile/user-profile.module").then(m => m.profileModule) },
      { path: 'forms', loadChildren: () => import("../../../pages/fabrication-management/support-forms/support-forms.module").then(m => m.SupportFormsModule) },
      { path: 'inbox', loadChildren: () => import("../../../pages/fabrication-management/support-forms/support-forms.module").then(m => m.SupportFormsModule) },
      { path: 'support-fabrication', loadChildren: () => import("../../../pages/fabrication-management/Support-fabrication-module/support-fabrication-module.module").then(m => m.SupportFabricationModuleModule) },
      { path: 'support-fabrication/mto', loadChildren: () => import("../../../pages/fabrication-management/Engineering/mat-takeoff/mat-takeoff.module").then(m => m.MatTakeoffModule) },
      { path: 'reports', loadChildren: () => import("../../../pages/reports/reports.module").then(m => m.ReportsModule) },
      { path: 'form-engine', loadChildren: () => import("../../../pages/form-engine/form-engine.module").then(m => m.FormEngineModule) },
      { path: 'materials-takeoff', component: MaterialsTakeoffComponent },
      { path: 'mto-view', component: MtoViewComponent },
      { path: 'role-groups', component: RoleGroupsComponent },
    ],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainRoutingModule { }
