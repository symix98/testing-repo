import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CommentComponent } from '../../../comment/comment.component';
import { FileFolderPropertiesComponent } from 'src/app/pages/document-management/file-folder-properties/file-folder-properties.component';
import { Router } from '@angular/router';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DownloadDocumentsDialogComponent } from 'src/app/pages/document-management/components/download-documents-dialog/download-documents-dialog.component';
import { CreateHyperlinkDialogComponent } from 'src/app/pages/document-management/hyperlink/create-hyperlink-dialog/create-hyperlink-dialog.component';
import { MoveFilesDialogComponent } from 'src/app/pages/document-management/components/move-files-dialog/move-files-dialog.component';
import { TreeDataSourceService } from 'src/app/core/services/tree-datasource.service';
import { AttachFileToDocComponent } from 'src/app/pages/document-management/components/attach-file-to-doc/attach-file-to-doc.component';
import { AddNewRevisionDialogComponent } from 'src/app/pages/document-management/components/add-new-revision-dialog/add-new-revision-dialog.component';

@Component({
  selector: 'app-table-row-menu',
  templateUrl: './table-row-menu.component.html',
  styleUrls: ['./table-row-menu.component.scss'],
})

export class TableRowMenuComponent implements OnInit {

  @Input() data;
  items: MenuItem[];
  documentForm: Document = new Document();

  constructor(
    private dialogService: DialogService, private apiService: ApiService,
    private utilitiesService: UtilitiesService, private router: Router,
    private treeDatasourceService: TreeDataSourceService
  ) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Get Link',
        icon: 'pi pi-link',
        command: () => {
          this.dialogService.open(CreateHyperlinkDialogComponent,{
            header: "Share \"" + this.data.documentsNumber  + "\"",
            width: '30%',
            data: this.data,
          })
        },
      },
      {
        label: 'Download',
        icon: 'pi pi-download',
        command: () => {
          this.dialogService.open(DownloadDocumentsDialogComponent, {
            header: "Download",
            width: '60%',
            data: this.data,
          })
        },
      },
      {
        label: 'Open',
        icon: 'pi pi-desktop',
        command: () => {
          const id = this.data.id;
          const url = `http://localhost:4200/#/documents/edit-document?id=${id}`;
          window.open(url, '_blank');
        },
      },
      {
        label: 'Create New Revision',
        icon: 'pi pi-file',
        command: () => {
          this.dialogService.open(AddNewRevisionDialogComponent,{
            header: "Add New Document Revision",
            data: this.data,
            width: '40%',
            height: '50vh',
          }).onClose.subscribe((result) => {
            if(result){
              this.utilitiesService.notifySuccess('Document Revised successfully!')
              this.treeDatasourceService.refreshTable.next(true)
            }
          });
        },
      },
      {
        label: 'Attach New File',
        icon: 'pi pi-file',
        command: () => {
          this.dialogService.open(AttachFileToDocComponent,{
            header: "Add New File To Document",
            data: this.data,
            width: '40%',
            height: '50vh',
          }).onClose.subscribe((result) => {
            if(result){
              this.utilitiesService.notifySuccess('File added successfully!')
              this.treeDatasourceService.refreshTable.next(true)
            }
          });
        },
      },
      {
        label: 'Move',
        icon: 'pi pi-folder',
        command: () => {
          this.dialogService.open(MoveFilesDialogComponent,{
            header: "Move File to Folder",
            data: this.data,
            width: '40%',
            height: '50vh',
          }).onClose.subscribe((result) => {
            if(result){
              this.utilitiesService.notifySuccess('File moved successfully!')
              this.treeDatasourceService.refreshTable.next(true)
            }
          });
        },
      },
      {
        label: 'Work Flow',
        icon: 'pi pi-sitemap',
        items: [
          {
            label: 'Next Status',
            command: () => {
              this.dialogService.open(CommentComponent, {
                width: '35%',
                data: {
                  id: this.data.id,
                  label: 'Next Status',
                  properties: this.data,
                },
              }).onClose.subscribe((res) => { });
            },
          },
          {
            label: 'Previous Status',
            command: () => {
              this.dialogService.open(CommentComponent, {
                width: '35%',
                data: {
                  id: this.data.id,
                  label: 'Previous Status',
                  properties: this.data,
                },
              }).onClose.subscribe((res) => {
                // if (res)
                //   this.updateRevision();
              });
            },
          },
          {
            label: 'Set Final Status',
            command: () => {
              this.dialogService.open(CommentComponent, {
                width: '35%',
                data: {
                  id: this.data.id,
                  label: 'Set Final Status',
                  properties: this.data,
                },
              }).onClose.subscribe((res) => { });
            },
          },
        ],
      },
      {
        label: 'Rename',
        icon: 'pi pi-pencil',
        command: () => { },
      },
      {
        label: 'Properties',
        icon: 'pi pi-info',
        command: () => {
          this.dialogService.open(FileFolderPropertiesComponent, {
            header: 'Properties',
            height: 'auto',
            width: 'auto',
            data: {
              properties: this.data,
              folderId: localStorage.getItem("folderId"),
            },
            modal: true,
          }).onClose.subscribe((result) => {
            if (result) {
              setTimeout(() => {
                this.ngOnInit();
              }, 10);
            } else {}
          })
        },
      },

      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
            if (confirm) {
              this.apiService.delete(ApiURL.documentss + '/' + this.data.id).subscribe(
                (res) => {
                  this.utilitiesService.notifySuccess('Document Deleted');
                  this.ngOnInit();
                },
                (err) => {
                  this.utilitiesService.notifyError('Something Wrong Happend!');
                }
              );
            }
          });
        },
      },
    ];
  }

  updateRevision() {
    let state = this.data;
    state.revisionDate = new Date();
    state.revision = this.data.revision + 1;
    this.apiService.patch(ApiURL.documentss + '/' + this.data.id, state).subscribe(
      (res) => { },
      (err) => { }
    );
  }
}
