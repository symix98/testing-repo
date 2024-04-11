import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FormType } from 'src/app/core/miscellaneous/global-props.template';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-attach-file-to-doc',
  templateUrl: './attach-file-to-doc.component.html',
  styleUrls: ['./attach-file-to-doc.component.scss']
})
export class AttachFileToDocComponent implements OnInit {

  isUploading:boolean = false
  uploadedDocument:any
  uploadedFiles:any[] =[]
  constructor(private router: Router,
    private apiService: ApiService,
    private activatedRouteService: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private dateService: DateService,
    private dialogService: DialogService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
    ) { }

  ngOnInit(): void {
    this.uploadedDocument = this.dynamicDialogConfig.data
  }
  
  onUpload(e) {
    e.files.forEach(file => {
      console.log(file)
      this.uploadDoc(file,this.uploadedDocument)
    });

  }
  async uploadDoc(file , uploadedDocument) {
    this.isUploading = true
    let user = await this.utilitiesService.getCurrentAppUser();
    this.utilitiesService.convertFiletoBase64(file).then(base64File => {
      let document = {
        documentId: this.utilitiesService.generateUUID(),
        formId: uploadedDocument.id,
        description: uploadedDocument.title,
        creationDate: new Date(),
        title: uploadedDocument.documentsNumber,
        mimeType: file.type != '' ? file.type : 'application/octet-stream',
        folder: FormType.Doc,
        formType: FormType.Doc,
        fileName: file.name,
        createdBy: user.name,
        modifiedBy: user.name,
        version: '0',
        modificationDate: new Date(),
        file: base64File
      };

      this.apiService.post(ApiURL.documents, document).subscribe(
        (res) => {
          let obj = {
            id : uploadedDocument.id,
            fileName: file.name,
            size : this.transformFileSize(file.size,1)
          }
          this.apiService.patch(ApiURL.documentss+ "/" + uploadedDocument.id,obj).subscribe(res =>{
            this.dialogRef.close(true);
          })
          
        },
        (err) => {
          this.utilitiesService.notifyError('Error uploading the document!');
        }
      );
    })

  }

  transformFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
