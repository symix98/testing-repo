import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectInfoComponent } from 'src/app/pages/settings/project-info/project-info.component';
import { ProjectSettingsComponent } from 'src/app/pages/settings/project-settings/project-settings.component';
import { DisciplinesComponent } from 'src/app/pages/settings/reference-components/disciplines/disciplines.component';
import { DocumentsSubTypeComponent } from 'src/app/pages/settings/reference-components/documents-sub-type/documents-sub-type.component';
import { DocumentsTypeComponent } from 'src/app/pages/settings/reference-components/documents-type/documents-type.component';
import { FilesTypeComponent } from 'src/app/pages/settings/reference-components/files-type/files-type.component';
import { OrganizerComponent } from 'src/app/pages/settings/reference-components/organizer/organizer.component';
import { RecipientComponent } from 'src/app/pages/settings/reference-components/recipient/recipient.component';
import { ReferenceComponentsComponent } from 'src/app/pages/settings/reference-components/reference-components.component';
import { StatusComponent } from 'src/app/pages/settings/reference-components/status/status.component';
import { SettingsComponent } from 'src/app/pages/settings/settings.component';
import { SupportStatusRefComponent } from 'src/app/pages/settings/support-settings/support-status-ref/support-status-ref.component';
import { UsersComponent } from 'src/app/pages/settings/users/users.component';

const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      { path: 'project-settings', component: ProjectSettingsComponent },
      { path: 'status-settings', component: SupportStatusRefComponent },
      { path: 'project-info', component: ProjectInfoComponent },
      { path: 'users', component: UsersComponent },
      { path: 'reference-tables', component: ReferenceComponentsComponent},
      { path: 'files-type', component: FilesTypeComponent },
      { path: 'document-type', component: DocumentsTypeComponent },
      { path: 'document-sub-type', component: DocumentsSubTypeComponent },
      { path: 'discipline', component: DisciplinesComponent },
      { path: 'status', component: StatusComponent },
      { path: 'organizer', component: OrganizerComponent },
      { path: 'recipient', component: RecipientComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SettingsRoutingModule { }
