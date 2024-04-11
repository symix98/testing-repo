import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentManagementRoutingModule } from '../../core/modules/routing/document-management-routing.module';
import { DocumentManagementComponent } from './document-management.component';
import { DocDatasourceComponent } from './doc-datasource/doc-datasource.component';
import { DocumentsManagListComponent } from './documents-manag-list/documents-manag-list.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { DocumentFormWizzardModule } from '../document-form-wizzard/document-form-wizzard.module';
import { CreateNewFolderComponent } from './components/create-new-folder/create-new-folder.component';
import { DocumentFilterComponent } from '../document-filter/document-filter.component';
import { FilterResultComponent } from '../document-filter/filter-result/filter-result.component';
import { UserFilterComponent } from '../document-filter/user-filter/user-filter.component';
import { FilterPropertyComponent } from '../document-filter/filter-property/filter-property.component';
import { FilterquerySaveComponent } from '../document-filter/filterquery-save/filterquery-save.component';
import { FileFolderPropertiesComponent } from './file-folder-properties/file-folder-properties.component';
import { DocProprtiesTabComponent } from './file-folder-properties/components/doc-proprties-tab/doc-proprties-tab.component';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';
import { LibraryViewComponent } from './library-view/library-view.component';
import { TransmittalComponent } from './components/transmittal/transmittal.component';
import { AddRecipientComponent } from './components/add-recipient/add-recipient.component';
import { AddDocumentsComponent } from './components/add-documents/add-documents.component';
import { TransmittalNumbringComponent } from './components/transmittal/transmittal-numbring/transmittal-numbring.component';
import { RegisterTransmittalComponent } from './components/transmittal/register-transmittal/register-transmittal.component';
import { FlowViewerComponent } from './file-folder-properties/components/flow-viewer/flow-viewer.component';
import { UploadingDocumentsDialogComponent } from './components/uploading-documents-dialog/uploading-documents-dialog.component';
import { DownloadDocumentsDialogComponent } from './components/download-documents-dialog/download-documents-dialog.component';
import { TransmittalsListComponent } from './components/transmittal/transmittals-list/transmittals-list.component';
import { SharedDocPreviewComponent } from './hyperlink/shared-doc-preview/shared-doc-preview.component';
import { CreateHyperlinkDialogComponent } from './hyperlink/create-hyperlink-dialog/create-hyperlink-dialog.component';
import { MoveFilesDialogComponent } from './components/move-files-dialog/move-files-dialog.component';
import { DocGeneralPropertiesTabComponent } from './file-folder-properties/components/doc-general-properties-tab/doc-general-properties-tab.component';
import { FolderSecurityComponent } from './file-folder-properties/components/folder-security/folder-security.component';
import { InboxTransmittalComponent } from './components/transmittal/inbox-transmittal/inbox-transmittal.component';
import { DocumentTrackComponent } from './components/document-track/document-track.component';
import { DocumentReviewComponent } from './components/document-track/document-review/document-review.component';
import { DocumentTimelineComponent } from './components/document-track/document-timeline/document-timeline.component';
import { FolderPropertiesComponent } from './file-folder-properties/components/folder-properties/folder-properties.component';
import { AddFolderPropsComponent } from './file-folder-properties/components/folder-properties/add-folder-props/add-folder-props.component';
import { DocRelationsComponent } from './components/edit-document/components/doc-relations/doc-relations.component';
import { DocumentHistoryComponent } from './file-folder-properties/components/document-history/document-history.component';
import { AttachFileToDocComponent } from './components/attach-file-to-doc/attach-file-to-doc.component';
import { AddNewRevisionDialogComponent } from './components/add-new-revision-dialog/add-new-revision-dialog.component';

@NgModule({
  declarations: [
    DocumentManagementComponent,
    DocDatasourceComponent,
    DocumentsManagListComponent,
    CreateNewFolderComponent,
    DocumentFilterComponent,
    FilterResultComponent,
    UserFilterComponent,
    FilterPropertyComponent,
    FilterquerySaveComponent,
    FileFolderPropertiesComponent,
    DocProprtiesTabComponent,
    EditDocumentComponent,
    LibraryViewComponent,
    TransmittalComponent,
    AddRecipientComponent,
    AddDocumentsComponent,
    TransmittalNumbringComponent,
    RegisterTransmittalComponent,
    FlowViewerComponent,
    UploadingDocumentsDialogComponent,
    DownloadDocumentsDialogComponent,
    SharedDocPreviewComponent,
    CreateHyperlinkDialogComponent,
    TransmittalsListComponent,
    SharedDocPreviewComponent,
    MoveFilesDialogComponent,
    DocGeneralPropertiesTabComponent,
    FolderSecurityComponent,
    InboxTransmittalComponent,
    DocumentTrackComponent,
    DocumentReviewComponent,
    DocumentTimelineComponent,
    FolderPropertiesComponent,
    AddFolderPropsComponent,
    DocRelationsComponent,
    DocumentHistoryComponent,
    AttachFileToDocComponent,
    AddNewRevisionDialogComponent
  ],
  imports: [
    CommonModule,
    DocumentManagementRoutingModule,
    SharedModule,
    DocumentFormWizzardModule
  ]
})
export class DocumentManagementModule { }
