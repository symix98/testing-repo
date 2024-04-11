import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-move-files-dialog',
  templateUrl: './move-files-dialog.component.html',
  styleUrls: ['./move-files-dialog.component.scss']
})
export class MoveFilesDialogComponent implements OnInit {

  path: any;
  filePath: any;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private dateSarvice:DateService,
    private utilitiesService :UtilitiesService,
    private apiService:ApiService
  ) { }
  breadcrumbPath: MenuItem[];
  ngOnInit(): void {
    
  }

  oneNodeSelected(e) {
    this.path = e
    this.path = this.path.reverse()
    this.path[0].icon = 'pi pi-home pi-fw'
    this.path.forEach((p,i) =>{
      p.id = i + ''
    })
    let pathString = ""
    this.path.forEach(e =>{
      if(pathString == ""){
        pathString = e.label
      }else{
        pathString = pathString + '/' + e.label
      }
      
    })
    this.breadcrumbPath = this.path
    this.filePath = null
    setTimeout(() => {
      this.filePath = pathString


    }, 10);
  }

  moveFile() {
    let data = this.dynamicDialogConfig.data

    data.path = this.filePath
    this.apiService.patch(ApiURL.documentss+ "/" + data.id , data).subscribe(res =>{

      this.dialogRef.close(true);
    })
  }


}
