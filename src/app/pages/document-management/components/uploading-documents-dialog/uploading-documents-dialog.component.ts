import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FormType } from 'src/app/core/miscellaneous/global-props.template';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-uploading-documents-dialog',
  templateUrl: './uploading-documents-dialog.component.html',
  styleUrls: ['./uploading-documents-dialog.component.scss']
})
export class UploadingDocumentsDialogComponent implements OnInit, OnChanges {


  @Input() data: any;
  uploadingList: any[] = []
  isLoading: boolean[] = []
  @Input() documents: any[]
  @Output() onFileUpload = new EventEmitter<any>();
  constructor(
    private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private dateService: DateService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.uploadDocumentProperties()
  }


  ngOnInit(): void {
    this.uploadDocumentProperties()
  }

  async uploadDocumentProperties() {
    let user = await this.utilitiesService.getCurrentAppUser()
    let uploadedDocument = [];
    try {
      uploadedDocument = [...JSON.parse(sessionStorage.getItem('docList'))];
    } catch {

    }
    let path = localStorage.getItem('filePath');
    let uploadedDocumentProp = [...JSON.parse(sessionStorage.getItem('documentProperties'))];
    if (!uploadedDocumentProp || uploadedDocumentProp.length === 0) {
      console.error('No documents to upload.');
      return;
    }

    for (let i = 0; i < uploadedDocumentProp.length; i++) {
      let attributes = uploadedDocumentProp[i]
      let fileToUpload = uploadedDocument.filter(e => e.name == attributes.fileName)
      console.log(uploadedDocument)
      console.log(fileToUpload)
      let docProp = attributes
      if (fileToUpload.length > 0) {
        docProp.documentsNumber = fileToUpload[0].docno
        docProp.ssize = fileToUpload[0].size
        docProp.fileType = fileToUpload[0].type

        docProp.createdBy = user.name
        docProp.dateModified = this.dateService.systemDateFormat(new Date())
        docProp.revision = "0"
        docProp.revisionDate = new Date()
        docProp.fileName = fileToUpload[0].name
        docProp.path = path
        docProp.fileType = fileToUpload[0].type
        docProp.projectField1 = ''
        console.log(fileToUpload)
        this.saveRequest(fileToUpload[0], user, i, docProp)
      } else {
        docProp.createdBy = user.name
        docProp.dateModified = this.dateService.systemDateFormat(new Date())
        docProp.revisionDate = new Date()
        docProp.path = path
        docProp.projectField1 = ''
        this.saveRequest(null, user, i, docProp)
      }
    }
    this.closeDialog()
  }

  closeDialog() {
    sessionStorage.removeItem('docList')
    sessionStorage.removeItem('docNumber')
    sessionStorage.removeItem('documentProperties')

  }

  uploadDoc(uploadedDocument, user, doc, i) {
    this.utilitiesService.convertFiletoBase64(this.documents[i].data).then(base64File => {


      let document = {
        documentId: this.utilitiesService.generateUUID(),
        formId: doc.id,
        description: uploadedDocument.docno,
        creationDate: new Date(),
        title: uploadedDocument.name,
        mimeType: this.documents[i].data.type != '' ? this.documents[i].data.type : 'application/octet-stream',
        folder: FormType.Doc,
        formType: FormType.Doc,
        fileName: uploadedDocument.name,
        createdBy: user.name,
        modifiedBy: user.name,
        version: '0',
        modificationDate: new Date(),
        file: base64File
      };
      console.log(document)
      this.apiService.post(ApiURL.documents, document).subscribe(
        (res) => {
          this.isLoading[i] = false
          this.onFileUpload.emit("reload")

        },
        (err) => {
          this.utilitiesService.notifyError('Error uploading the document!');
        }
      );
    })

  }

  // saveRequest(uploadedDocument, user, i, docProp) {
  //   if (uploadedDocument != null) {
  //     this.uploadingList.push(uploadedDocument)
  //   } else {
  //     let obj = {
  //       docno: docProp.documentsNumber
  //     }
  //     this.uploadingList.push(obj)
  //   }

  //   this.isLoading[i] = false
  //   this.apiService.post(ApiURL.documentss, docProp).subscribe(
  //     (res) => {
  //       if (uploadedDocument != null) {
  //         this.isLoading[i] = true
  //         this.uploadDoc(uploadedDocument, user, res, i);
  //       } else {
  //         this.onFileUpload.emit("reload")
  //       }
  //     },
  //     (err) => {
  //       this.utilitiesService.notifyError(err.error.details);
  //     }
  //   );
  // }


  async saveRequest(uploadedDocument, user, i, docProp) {
    // if (docProp.documentsNumber == null) {
    //   this.utilitiesService.notifyError("Document Number Missing!")
    //   return;
    // }

    let documentId: number = 0
    let docId: number = await this.checkDocExists(docProp);
    documentId = docId

    if (uploadedDocument != null) {
      this.uploadingList.push(uploadedDocument)
    } else {
      let obj = {
        docno: docProp.documentsNumber
      }
      this.uploadingList.push(obj)
    }

    if (documentId == 0) {
      this.isLoading[i] = false
      this.apiService.post(ApiURL.documentss, docProp).subscribe(
        (res) => {
          if (uploadedDocument != null) {
            this.isLoading[i] = true
            this.uploadDoc(uploadedDocument, user, res, i);
          } else {
            this.onFileUpload.emit("reload")
          }
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
    } else {

      docProp = {
        id: documentId,
        ...docProp,
      };

      this.isLoading[i] = false
      this.apiService.patch(ApiURL.documentss + "/" + documentId, docProp).subscribe(
        (res) => {
          if (uploadedDocument != null) {
            this.isLoading[i] = true
            this.uploadDoc(uploadedDocument, user, res, i);
          } else {
            this.onFileUpload.emit("reload")
          }
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
    }
  }


  checkDocExists(docProp: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let docMissing: boolean = false;
      let query: ApiQuery = new ApiQuery();
      query.filter = new Map<any, any>([['documentsNumber', docProp.documentsNumber]])

      this.apiService.get(ApiURL.documentss, query).subscribe(res => {
        if (res.length) {

          if (res.fileName == null || res.fileName == "") {
            resolve(res[0].id)
          }
        }
        resolve(0);
      },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
    });
  }

}
