import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-doc-proprties-tab',
  templateUrl: './doc-proprties-tab.component.html',
  styleUrls: ['./doc-proprties-tab.component.scss'],
})
export class DocProprtiesTabComponent implements OnInit, AfterContentChecked {
  @Input() data: Document = new Document();
  @Input() flag: boolean;

  editMode: boolean = false;
  imageSrc: string;

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

  subscriptions = new Subscription();

  constructor(
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.flag);   
    this.setDocumentImage();
    this.getReferenceTablesData();
  }

  setDocumentImage() {
    if (this.data.fileType === 'PDF') {
      this.imageSrc = '../../../../../../assets/images/pdf-logo.png';
    } else {
      this.imageSrc = '../../../../../../assets/images/excel-logo.png';
    }
  }

  downloadFile() {
    const documentArray: any[] = [this.data];
    this.utilitiesService.exportAsExcelFile(documentArray, 'document-properties');
  }

  async update() {
    this.data.revision = (parseInt(this.data.revision) + 1).toString();
    this.data.revisionDate = new Date();
    this.data.revisionDate.setHours(this.data.revisionDate.getHours() + 3);
    this.data.dateModified = new Date();
    this.data.dateModified.setHours(this.data.dateModified.getHours() + 3);
    this.data.lastModifiedDate = new Date();
    this.data.lastModifiedDate.setHours(
      this.data.lastModifiedDate.getHours() + 3
    );
    if (parseInt(this.data.revision) > 0) {
      // this.data.projectField1 = 'history';
    }
    console.log(this.data);
    this.apiService
      .put(ApiURL.documentss + '/' + this.data.id, this.data)
      .subscribe(
        (res) => {
          this.utilitiesService.notifySuccess('Document Updated');
        },
        (err) => {
          this.utilitiesService.notifyError('Update Failed');
        }
      );
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
        this.populateDocumentInputFields(this.data);
      },
      error(err) {},
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  turnOnEditMode() {
    this.editMode = true;
  }

  populateDocumentInputFields(data: any) {
    console.log(this.data);
    this.data.documentsNumber = this.data.documentsNumber;
    this.data.revision = this.data.revision;
    if (this.data.revisionDate !== null) {
      this.data.revisionDate = new Date(this.data.revisionDate);
    }
    if (data.revision < new Date()) {
      this.oldRevision = true;
    }
    this.data.version = this.data.version;
    this.data.fileType = this.data.fileType;
    this.data.title = this.data.title;
    this.data.phase = this.data.phase;
    this.data.activityID = this.data.activityID;
    this.data.classes = this.data.classes;
    this.data.documentsFor = this.data.documentsFor;
    this.data.initiatedBy = this.data.initiatedBy;
    this.data.disciplines = this.data.disciplines;
    if (this.data.receiveDate !== null) {
      this.data.receiveDate = new Date(this.data.receiveDate);
    }

    this.data.replyRequired = this.data.replyRequired;
    this.data.replyRequiredBy = this.data.replyRequiredBy;
    if (this.data.repliedDate !== null) {
      this.data.repliedDate = new Date(this.data.repliedDate);
    }
    if (this.data.dateModified !== null) {
      this.data.dateModified = new Date(this.data.dateModified);
    }
    if (this.data.lastModifiedDate !== null) {
      this.data.lastModifiedDate = new Date(this.data.lastModifiedDate);
    }
    if (this.data.plannedSubmissionDate !== null) {
      this.data.plannedSubmissionDate = new Date(
        this.data.plannedSubmissionDate
      );
    }
    this.data.tqStatus = this.data.tqStatus;
    this.data.filesType = this.findOptionByName(
      this.data.filesType,
      this.filesTypeRefs
    );
    this.data.documentsType = this.findOptionByName(
      this.data.documentsType,
      this.documentTypeRefs
    );

    this.data.documentsSubType = this.findOptionByName(
      this.data.documentsSubType,
      this.documentSubTypeRefs
    );

    this.data.disciplines = this.data.disciplines;
    this.data.status = this.findOptionByName(
      this.data.status,
      this.statusesRefs
    );

    if (this.data.orgnizer) {
      this.data.orgnizer = this.findOptionByName(
        this.data.orgnizer,
        this.organizerIdRefs
      );
    }

    this.data.recipient = this.findOptionByName(
      this.data.recipient,
      this.recipientIdRefs
    );

    this.data.accptanceCode = this.findOptionByName(
      this.data.accptanceCode,
      this.acceptanceCodeRefs
    );

    this.data.categories = this.findOptionByName(
      this.data.categories,
      this.categoriesIdRefs
    );

    this.data.subSystem = this.findOptionByName(
      this.data.subSystem,
      this.subSystemIdRefs
    );
  }

  findOptionByName(refTableObject: any, options: any[]): any {
    if (refTableObject && options) {
      return options.find((option) => option.name === refTableObject.name);
    }
  }
}
