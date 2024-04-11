import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss'],
})
export class EditDocumentComponent implements OnInit, AfterContentChecked {
  document: Document = new Document();
  transmittalDocuments: any[] = [];
  documentId: number;
  historyDocuments:any[]
  imageSrc: string;
  editMode: boolean = false;
allDocuments: any[] = []
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
  oldRevision: boolean;
  activeIndex: number;
  subscriptions = new Subscription();

  constructor(
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdref: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe((params) => {
      this.documentId = params['id'];
    });
  }

  ngOnInit(): void {
    this.getReferenceTablesData();
  }

  setDocumentImage() {
    if (this.document.fileType === 'PDF') {
      this.imageSrc = '../../../../../../assets/images/pdf-logo.png';
    } else {
      this.imageSrc = '../../../../../../assets/images/excel-logo.png';
    }
  }

  async getDocumentById() {
    try {
      const res = await this.apiService
        .get(ApiURL.documentss + '/' + this.documentId)
        .toPromise();
      this.document = res;
      this.getHistory()
      this.setDocumentImage();
      this.populateDocumentInputFields(this.document);
      this.getSentTransmittalsData();
    } catch (err) {
      this.utilitiesService.notifyError(
        `Could not get document with id ${this.document.id}`
      );
    }
  }

getHistory(){
let query : ApiQuery = new ApiQuery()
query.filter = new Map<any,any>([['documentsNumber',this.document.documentsNumber]])
query.sort = ['id,desc']
this.apiService.get(ApiURL.documentss,query).subscribe(res =>{
  this.historyDocuments = res
})
}

  async getSentTransmittalsData() {
    try {
      const res = await this.apiService
        .get(ApiURL.transmittals + '?documentsId.equals=' + this.documentId)
        .toPromise();
      this.transmittalDocuments = res;
    } catch (err) {
      this.utilitiesService.notifyError(
        `Could not get document with id ${this.document.id}`
      );
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
      complete: () => {
        this.getDocumentById();
      },
      error(err) {},
    });
  }

  downloadFile() {
    const documentArray: any[] = [this.document];
    this.utilitiesService.exportAsExcelFile(
      documentArray,
      'document-properties'
    );
  }

  turnOnEditMode() {
    this.editMode = true;
  }

  async update() {
    this.document.revision = (parseInt(this.document.revision) + 1).toString();
    this.document.revisionDate = new Date();
    this.document.revisionDate.setHours(
      this.document.revisionDate.getHours() + 3
    );
    this.document.dateModified = new Date();
    this.document.dateModified.setHours(
      this.document.dateModified.getHours() + 3
    );
    this.document.lastModifiedDate = new Date();
    this.document.lastModifiedDate.setHours(
      this.document.lastModifiedDate.getHours() + 3
    );
    if(parseInt(this.document.revision) > 0) {
      // this.document.projectField1 = "history"
    }
    this.apiService
      .put(ApiURL.documentss + '/' + this.document.id, this.document)
      .subscribe(
        (res) => {
          this.utilitiesService.notifySuccess('Document Updated');
        },
        (err) => {
          this.utilitiesService.notifyError('Update Failed');
        }
      );
  }

  populateDocumentInputFields(data: any) {
    this.document.documentsNumber = data.documentsNumber;
    this.document.revision = data.revision;
    if (data.revisionDate !== null) {
      this.document.revisionDate = new Date(data.revisionDate);
    }
    if(data.revision < new Date()) {
      this.oldRevision = true;
    }
    this.document.version = data.version;
    this.document.fileType = data.fileType;
    this.document.title = data.title;
    this.document.phase = data.phase;
    this.document.activityID = data.activityID;
    this.document.classes = data.classes;
    this.document.documentsFor = data.documentsFor;
    this.document.initiatedBy = data.initiatedBy;
    this.document.disciplines = data.disciplines;
    if (data.receiveDate !== null) {
      this.document.receiveDate = new Date(data.receiveDate);
    }

    this.document.replyRequired = data.replyRequired;
    this.document.replyRequiredBy = data.replyRequiredBy;
    if (data.repliedDate !== null) {
      this.document.repliedDate = new Date(data.repliedDate);
    }
    if (data.dateModified !== null) {
      this.document.dateModified = new Date(data.dateModified);
    }
    if (data.lastModifiedDate !== null) {
      this.document.lastModifiedDate = new Date(data.lastModifiedDate);
    }
    if (data.plannedSubmissionDate !== null) {
      this.document.plannedSubmissionDate = new Date(
        data.plannedSubmissionDate
      );
    }
    this.document.tqStatus = data.tqStatus;
    if (data.filesType) {
      this.document.filesType = this.findOptionByName(
        data.filesType,
        this.filesTypeRefs
      );
    }
    if (data.documentsType) {
      this.document.documentsType = this.findOptionByName(
        data.documentsType,
        this.documentTypeRefs
      );
    }
    if (data.documentsSubType) {
      this.document.documentsSubType = this.findOptionByName(
        data.documentsSubType,
        this.documentSubTypeRefs
      );
    }
    if (data.status) {
      this.document.disciplines = data.disciplines;
      this.document.status = this.findOptionByName(
        data.status,
        this.statusesRefs
      );
    }
    if (data.orgnizer) {
      this.document.orgnizer = this.findOptionByName(
        data.orgnizer,
        this.organizerIdRefs
      );
    }
    if (data.recipient) {
      this.document.recipient = this.findOptionByName(
        data.recipient,
        this.recipientIdRefs
      );
    }
    if (data.accptanceCode) {
      this.document.accptanceCode = this.findOptionByName(
        data.accptanceCode,
        this.acceptanceCodeRefs
      );
    }
    if (data.categories) {
      this.document.categories = this.findOptionByName(
        data.categories,
        this.categoriesIdRefs
      );
    }
    if (data.subSystem) {
      this.document.subSystem = this.findOptionByName(
        data.subSystem,
        this.subSystemIdRefs
      );
    }
  }

  findOptionByName(dropdownlistObject: any, options: any[]): any {
    return options.find((option) => option.name === dropdownlistObject.name);
  }
}
