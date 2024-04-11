import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FoldersModel } from 'src/app/core/models/document-management/folders.model';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-create-new-folder',
  templateUrl: './create-new-folder.component.html',
  styleUrls: ['./create-new-folder.component.scss']
})
export class CreateNewFolderComponent implements OnInit {

folderName: string;
description: string;
location : string;
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private dateSarvice:DateService,
    private utilitiesService :UtilitiesService,
    private apiService:ApiService
  ) { }

  ngOnInit(): void {
    if(this.dynamicDialogConfig.data) {
      this.location = this.dynamicDialogConfig.data.location
    }
  }

  async createNewFolder() {
    let user = await this.utilitiesService.getCurrentAppUser()
    let folder:FoldersModel = new FoldersModel()
    folder.folderName = this.folderName
    folder.type = "Folder"
    folder.location = this.location
    folder.created = new Date()
    folder.createdBy = user.name

    this.apiService.post(ApiURL.folders,folder).subscribe((response)=>{
        
        this.apiService.post(ApiURL.documentss,{
          documentsNumber: folder.folderName,
          fileType:'FOLDER',
          path: this.location,
          title: this.description,
          version:0,
          revision:0,
          projectField1 : ''
        }).subscribe(res =>{
          this.utilitiesService.notifySuccess('Folder created successfully')
          this.dialogRef.close(true);
        });
        
    },error=>{
       console.log("Error",error)
       this.utilitiesService.notifyError(error.error)
    });
  }

}
