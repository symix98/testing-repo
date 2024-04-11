import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-download-documents-dialog',
  templateUrl: './download-documents-dialog.component.html',
  styleUrls: ['./download-documents-dialog.component.scss']
})
export class DownloadDocumentsDialogComponent implements OnInit {

  file:any
  isLoading:boolean = true;
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private dateSarvice:DateService,
    private utilitiesService :UtilitiesService,
    private apiService:ApiService
  ) { }

  ngOnInit(): void {
    if(this.dynamicDialogConfig.data){
      
    this.file  = this.dynamicDialogConfig.data;
    this.getRelatedFile()
    }
  }
  getRelatedFile(){
    let query:ApiQuery = new ApiQuery()
    query.filter = new Map<any,any>([['formId',this.file.id]])
    this.apiService.get(ApiURL.documents,query).subscribe(res =>{
      res.forEach(element => {
        this.getDoc(element)
      });
      
    })
  }
  getDoc(e){
    this.isLoading =true

    this.apiService.downloadFile(ApiURL.documents + "/download/" +e.documentId).subscribe((res:any) =>{
      this.isLoading =false
      let file = new Blob([res], { type: e.mimeType });
      if(e.mimeType == 'application/octet-stream'){
        let extension = this.file.fileName.split('.');
        this.utilitiesService.saveFileOnDisk(file,this.file.documentsNumber + '.' + extension[extension.length-1])
      }else{
        this.utilitiesService.saveFileOnDisk(file,this.file.documentsNumber)
      }
      
    },err =>{

      this.utilitiesService.notifyError("Faild to Download Document ! ")
      this.isLoading =false
    })
  }

}
