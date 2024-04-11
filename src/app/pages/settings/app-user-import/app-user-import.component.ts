import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-app-user-import',
  templateUrl: './app-user-import.component.html',
  styleUrls: ['./app-user-import.component.scss']
})
export class AppUserImportComponent implements OnInit {
  isUploading:boolean = false
  constructor(
    private utilities: UtilitiesService,
    private apiService: ApiService,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit(): void {

  }
  downloadTemp(){
    this.utilities.exportToCsv('app-user-Template', [["userId","email","name"]])

  }
  onUpload(e){
    
    if(e.files.length > 0){
      this.isUploading = true

      this.apiService.post(ApiURL.import_app_users,e.files[0]).subscribe(res =>{
        this.utilities.notifySuccess("Users Added")
        this.isUploading = false
        this.dialogRef.close(true)
      },(err)=>{
        this.utilities.notifyError("Something Wrong Happend")
        this.isUploading = false
        this.dialogRef.close(true)
      })
      e.files = []
    }
    
    
  }

}
