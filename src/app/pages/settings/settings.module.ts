import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from 'src/app/core/modules/routing/settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { SupportStatusRefComponent } from './support-settings/support-status-ref/support-status-ref.component';
import { SupportStatusFormComponent } from './support-settings/support-status-ref/components/support-status-form/support-status-form.component';
import { AppUserAddComponent } from './app-user-add/app-user-add.component';
import { AppUserImportComponent } from './app-user-import/app-user-import.component';
import { ReferenceComponentsComponent } from './reference-components/reference-components.component';
import { FilesTypeComponent } from './reference-components/files-type/files-type.component';
import { AddRefDataComponent } from './reference-components/add-ref-data/add-ref-data.component';
import { DocumentsTypeComponent } from './reference-components/documents-type/documents-type.component';
import { DocumentsSubTypeComponent } from './reference-components/documents-sub-type/documents-sub-type.component';
import { DisciplinesComponent } from './reference-components/disciplines/disciplines.component';
import { StatusComponent } from './reference-components/status/status.component';
import { OrganizerComponent } from './reference-components/organizer/organizer.component';
import { RecipientComponent } from './reference-components/recipient/recipient.component';
import { AcceptCodeComponent } from './reference-components/accept-code/accept-code.component';
import { CategoriesComponent } from './reference-components/categories/categories.component';
import { LocationComponent } from './reference-components/location/location.component';
import { AreaComponent } from './reference-components/area/area.component';
import { SubAreaComponent } from './reference-components/sub-area/sub-area.component';
import { RoleGroupsComponent } from './role-groups/role-groups.component';


@NgModule({
  declarations: [
    SettingsComponent,
    ProjectInfoComponent,
    ProjectSettingsComponent,
    RolesComponent,
    UsersComponent,
    SupportStatusRefComponent,
    SupportStatusFormComponent,
    AppUserAddComponent,
    AppUserImportComponent,
    ReferenceComponentsComponent,
    FilesTypeComponent,
    AddRefDataComponent,
    DocumentsTypeComponent,
    DocumentsSubTypeComponent,
    DisciplinesComponent,
    StatusComponent,
    OrganizerComponent,
    RecipientComponent,
    AcceptCodeComponent,
    CategoriesComponent,
    LocationComponent,
    AreaComponent,
    SubAreaComponent,
    RoleGroupsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
