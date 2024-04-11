import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/core/models/document.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import * as XLSX from 'xlsx';
import { FormType } from 'src/app/core/miscellaneous/global-props.template';
import { TreeDataSourceService } from 'src/app/core/services/tree-datasource.service';

@Component({
  selector: 'app-document-properties',
  templateUrl: './document-properties.component.html',
  styleUrls: ['./document-properties.component.scss'],
})
export class DocumentProperties implements OnInit, AfterContentChecked {
  documentForm: Document = new Document();
  documentNumber = JSON.parse(sessionStorage.getItem('docNumber')).documentname;
  currentUser;
  replyRequired!: string;

  // reference tables
  statusesRefs: any[] = [];
  documentTypeRefs: any[] = [];
  documentSubTypeRefs: any[] = [];
  filesTypeRefs: any[] = [];
  acceptanceCodeRefs: any[] = [];
  categoriesIdRefs: any[] = [];
  organizerIdRefs: any[] = [];
  recipientIdRefs: any[] = [];
  disciplineIdRefs: any[] = [];
  subSystemIdRefs: any[] = [];
  formType: FormType;
  user: any;
  subscriptions = new Subscription();

  constructor(
    private router: Router, private treeDataSourceService : TreeDataSourceService,
    private utilitiesService: UtilitiesService, private apiService: ApiService,
    private cdref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.getReferenceTablesData();
    this.documentForm.documentsNumber = this.documentNumber;
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    if(sessionStorage.getItem('documentFormData')) {
      // this.populateDocumentInputFields(JSON.parse(sessionStorage.getItem('documentFormData')));
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
 }

  getReferenceTablesData() {
    this.getDocumentsStatusReferenceTable();
  }
  getDocumentsStatusReferenceTable() {
    this.subscriptions.add(
      this.apiService.get(ApiURL.statuses).subscribe({
        next: (res) => {
          this.statusesRefs = res;
        },
        complete: () => {
          this.getDocumentsTypesReferenceTable();
        },
        error(err) {},
      })
    );
  }
  getDocumentsTypesReferenceTable() {
    this.apiService.get(ApiURL.documents_types).subscribe({
      next: (res) => {
        this.documentTypeRefs = res;
      },
      complete: () => {
        this.getDocumentsSubSystemsReference();
      },
      error(err) {},
    });
  }
  getDocumentsSubSystemsReference() {
    this.apiService.get(ApiURL.sub_systems).subscribe({
      next: (res) => {
        this.subSystemIdRefs = res;
      },
      complete: () => {
        this.getDocumentsFilesTypesReference();
      },
      error(err) {},
    });
  }
  getDocumentsFilesTypesReference() {
    this.apiService.get(ApiURL.files_types).subscribe({
      next: (res) => {
        this.filesTypeRefs = res;
      },
      complete: () => {
        this.getDocumentsAcceptanceCodeReference();
      },
      error(err) {},
    });
  }
  getDocumentsAcceptanceCodeReference() {
    this.apiService.get(ApiURL.acceptance_code).subscribe({
      next: (res) => {
        this.acceptanceCodeRefs = res;
      },
      complete: () => {
        this.getDocumentsSubTypesReference();
      },
      error(err) {},
    });
  }
  getDocumentsSubTypesReference() {
    this.apiService.get(ApiURL.documents_sub_types).subscribe({
      next: (res) => {
        this.documentSubTypeRefs = res;
      },
      complete: () => {
        this.getDocumentsCategoriesReference();
      },
      error(err) {},
    });
  }
  getDocumentsCategoriesReference() {
    this.apiService.get(ApiURL.categories_id_refs).subscribe({
      next: (res) => {
        this.categoriesIdRefs = res;
      },
      complete: () => {
        this.getDocumentsRecipientReference();
      },
      error(err) {},
    });
  }
  getDocumentsRecipientReference() {
    this.apiService.get(ApiURL.recipientIdRefs).subscribe({
      next: (res) => {
        this.recipientIdRefs = res;
      },
      complete: () => {
        this.getDocumentsDisciplineReference();
      },
      error(err) {},
    });
  }
  getDocumentsDisciplineReference() {
    this.apiService.get(ApiURL.discipline_id_refs).subscribe({
      next: (res) => {
        this.disciplineIdRefs = res;
      },
      complete: () => {
        this.getDocumentsOrganizerReference();
      },
      error(err) {},
    });
  }
  getDocumentsOrganizerReference() {
    this.apiService.get(ApiURL.organizer).subscribe({
      next: (res) => {
        this.organizerIdRefs = res;
        
      },
      complete: () => {},
      error(err) {},
    });
  }

  async save() {
    const documentBody = { ...this.documentForm };
    documentBody.revision = null;
    documentBody.revisionDate = null;
    documentBody.version = '';
    // documentBody.path = localStorage.getItem('filePath');
    this.saveRequest(documentBody);
  }

  saveRequest(documentBody) {
    this.apiService.post(ApiURL.documentss, documentBody).subscribe(
      (res) => {
        this.utilitiesService.notifySuccess('Document Added Successfully');
        this.utilitiesService.setDialogVisibility(false);
      },
      (err) => {
        this.utilitiesService.notifyError(err.error.details);
      }
    );
    this.resetDocumentForm();
  }

  uploadDocumentProperties() {
    let uploadedDocument = JSON.parse(sessionStorage.getItem('docList'));
    if (!uploadedDocument || uploadedDocument.length === 0) {
      return;
    }
    for (let i = 0; i < uploadedDocument.length; i++) {
      //1. post the documents Data 
      //2. post the file 
      //3. when finish uploading 
      let document = {
        documentId: this.utilitiesService.generateUUID(),
        serviceId: 'ae81fbd8-9f95-42dd-b90b-d67d4897978b',
        formId: 'new',
        description: uploadedDocument[i].docname,
        creationDate: new Date(),
        title: uploadedDocument[i].docname,
        mimeType: uploadedDocument[i].type,
        folder: FormType.Doc,
        formType: FormType.Doc,
        fileName: uploadedDocument[i].docname,
        createdBy: this.currentUser.name,
        modifiedBy: this.currentUser.name,
        version: '0',
        modificationDate: new Date(),
      };
      this.apiService.post(ApiURL.documents, document).subscribe(
        (res) => {
          this.utilitiesService.notifySuccess('Documents Uploaded');
          this.save();
        },
        (err) => {
          this.utilitiesService.notifyError('Error uploading the document!');
        }
      );
    }
  }

  closeDialog(){
    const documentBody = { ...this.documentForm };
    documentBody.revision = null;
    documentBody.revisionDate = null;
    documentBody.version = '';
    // documentBody.path = localStorage.getItem('filePath');
    this.treeDataSourceService.isClosedNewFileDialog.next(documentBody);
  }

  resetDocumentForm() {
    this.documentForm = new Document();
  }

  prevPage() {
    this.router.navigate(['documents/libraries/document-numbering']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  exportDocument() {
    const documentArray: Document[] = [this.documentForm];
    this.utilitiesService.exportAsExcelFile(documentArray, 'document-properties');
  }

  onFileChange(event: any): void {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // this.populateDocumentInputFields(data[1]);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // populateDocumentInputFields(data: any) {
  //   this.documentForm.documentsNumber = this.documentNumber;
  //   this.documentForm.revision = data[1];
  //   this.documentForm.revisionDate = this.convertExcelDateToJSDate(data[2]);
  //   this.documentForm.version = data[3];
  //   this.documentForm.fileType = this.getFileExtension(
  //     JSON.parse(sessionStorage.getItem('docList'))[0].name
  //   );
  //   this.documentForm.title = data[5];
  //   this.documentForm.phase = data[6];
  //   this.documentForm.classes = data[7];
  //   this.documentForm.documentsFor = data[8];
  //   this.documentForm.initiatedBy = this.currentUser.name;
  //   this.documentForm.disciplines = data[10];
  //   this.documentForm.receiveDate = this.convertExcelDateToJSDate(data[11]);
  //   this.documentForm.replyRequired = data[12];
  //   this.documentForm.replyRequiredBy = this.convertExcelDateToJSDate(data[13]);
  //   this.documentForm.repliedDate = this.convertExcelDateToJSDate(data[14]);
  //   (this.documentForm.tqStatus = data[15]),
  //     this.documentForm.path = data[16];
  //     this.documentForm.workflow = data[17];
  //     this.documentForm.currentStep = data[18];
  //     this.documentForm.ssize = data[19];
  //     this.documentForm.isTransmitted = data[20];
  //     this.documentForm.sstatus = data[21];
  //     this.documentForm.confidential = data[22];
  //     this.documentForm.additionalReference = data[23];
  //     this.documentForm.reviewStatus = data[24];
  //     this.documentForm.modelReference = data[25];
  //     this.documentForm.createdBy = data[26];
  //     this.documentForm.dateModified = data[27];
  //     this.documentForm.relatedItems = data[28];
  //     this.documentForm.accessLevel = data[29];
  //     this.documentForm.csiSpecCode = data[30];
  //     this.documentForm.current = data[31];
  //     this.documentForm.facilityCode = data[32];
  //     this.documentForm.fileName = data[33];
  //     this.documentForm.forecastSubmToClient = data[34];
  //     this.documentForm.jobNumber = data[35];
  //     this.documentForm.lock = data[36];
  //     this.documentForm.lastModifiedDate = data[37];
  //     this.documentForm.milestone = data[38];
  //     this.documentForm.numberOfMarkups = data[39];
  //     this.documentForm.activityID = data[40];
  //     this.documentForm.plannedSubmissionDate = data[41];
  //     this.documentForm.printSize = data[42];
  //     this.documentForm.purchaseOrder = data[43];
  //     this.documentForm.remarks = data[44];
  //     this.documentForm.reviewSource = data[45];
  //     this.documentForm.projectField1 = data[46];
  //     this.documentForm.projectField2 = data[47];
  //     this.documentForm.projectField3 = data[48];
  //     this.documentForm.projectField4 = data[49];
  //     this.documentForm.projectField5 = data[50];
  //     this.documentForm.projectField6 = data[51];
  //     this.documentForm.projectField7 = data[52];
  //     this.documentForm.filesType = this.findOptionByName(
  //       data[53],
  //       this.filesTypeRefs
  //     );
  //     (this.documentForm.documentsType = this.findOptionByName(
  //       data[54],
  //       this.documentTypeRefs
  //     ));
  //   this.documentForm.documentsSubType = this.findOptionByName(
  //     data[55],
  //     this.documentSubTypeRefs
  //   );
  //   this.documentForm.discipline = this.findOptionByName(
  //     data[56],
  //     this.disciplineIdRefs
  //   );
  //     this.documentForm.status = this.findOptionByName(
  //       data[57],
  //       this.statusesRefs
  //     );
  //     (this.documentForm.orgnizer = this.findOptionByName(
  //       data[58],
  //       this.organizerIdRefs
  //     ));
  //   this.documentForm.recipient = this.findOptionByName(
  //     data[59],
  //     this.recipientIdRefs
  //   );
  //   this.documentForm.accptanceCode = this.findOptionByName(
  //     data[60],
  //     this.acceptanceCodeRefs
  //   );
  //   this.documentForm.categories = this.findOptionByName(
  //     data[61],
  //     this.categoriesIdRefs
  //   );
  //   this.documentForm.subSystem = this.findOptionByName(
  //     data[62],
  //     this.subSystemIdRefs
  //   );
  //   this.saveDataInSessionStorage()
  // }

  findOptionByName(name: string, options: any[]): any {
    return options.find((option) => option.name === name);
  }

  convertExcelDateToJSDate(excelDateSerial: number): Date {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const excelStartDate = new Date('1899-12-30T00:00:00Z');
    const jsDate = new Date(excelStartDate.getTime() + excelDateSerial * millisecondsInOneDay);
    return jsDate;
  }

  getFileExtension(fileName: string): string | null {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return null; // No file extension found
    }

    const extension = fileName.slice(lastDotIndex + 1);
    return extension.toUpperCase(); // Convert to lowercase for consistency
  }

  // saveDataInSessionStorage() {
  //   sessionStorage.setItem('documentFormData', JSON.stringify(this.documentForm));
  // }

}
