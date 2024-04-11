import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Document } from 'src/app/core/models/document.model';
import { ApiService } from 'src/app/core/services/api.service';
import { TreeDataSourceService } from 'src/app/core/services/tree-datasource.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-document-multipleproperties',
  templateUrl: './document-multipleproperties.component.html',
  styleUrls: ['./document-multipleproperties.component.scss'],
})
export class DocumentMultiplepropertiesComponent implements OnInit {
  // documentForm1: any = new Document();
  currentUser;

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
  subscriptions;
  editingTable: boolean;
  isEditedDocument: boolean = false;

  documentForm: any = [
    {
      documentsNumber: null,
      revision: null,
      revisionDate: null,
      version: null,
      fileType: null,
      title: null,
      phase: null,
      classes: null,
      documentsFor: null,
      initiatedBy: null,
      disciplines: null,
      receiveDate: null,
      replyRequired: null,
      replyRequiredBy: null,
      repliedDate: null,
      tqStatus: null,
      path: null,
      workflow: null,
      currentStep: null,
      ssize: null,
      isTransmitted: null,
      sstatus: null,
      confidential: null,
      additionalReference: null,
      reviewStatus: null,
      modelReference: null,
      createdBy: null,
      dateModified: null,
      relatedItems: null,
      accessLevel: null,
      csiSpecCode: null,
      current: null,
      facilityCode: null,
      fileName: null,
      forecastSubmToClient: null,
      jobNumber: null,
      lock: null,
      lastModifiedDate: null,
      milestone: null,
      numberOfMarkups: null,
      activityId: null,
      plannedSubmissionDate: null,
      printSize: null,
      purchaseOrder: null,
      remarks: null,
      reviewSource: null,
      filesType: null,
      documentsType: null,
      documentsSubType: null,
      orgnizer: null,
      recipient: null,
      accptanceCode: null,
      categories: null,
      subSystem: null,
    },
  ];

  docPropertyCols: any[] = [];
  // documentDetails: any[] = [];

  constructor(
    private utilitiesService: UtilitiesService,
    private router: Router,
    private treeDataSourceService: TreeDataSourceService,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.docPropertyCols = [
      { header: 'Document Number', field: 'documentsNumber', type: 'string' },
      { header: 'Revision', field: 'revision', type: 'string' },
      { header: 'Revision Date', field: 'revisionDate', type: 'date' },
      { header: 'Version', field: 'version', type: 'string' },
      { header: 'File Type', field: 'fileType', type: 'string' },
      { header: 'Title', field: 'title', type: 'string' },
      { header: 'Phase', field: 'phase', type: 'string' },
      { header: 'Classes', field: 'classes', type: 'string' },
      { header: 'Documents For', field: 'documentsFor', type: 'string' },
      { header: 'Initiated By', field: 'initiatedBy', type: 'string' },
      { header: 'Discipline', field: 'disciplines', type: 'dropdown' },
      { header: 'Receive Date', field: 'receiveDate', type: 'string' },
      { header: 'Reply Required', field: 'replyRequired', type: 'string' },
      { header: 'Reply Required By', field: 'replyRequiredBy', type: 'date' },
      { header: 'Replied Date', field: 'repliedDate', type: 'date' },
      { header: 'TQ Status', field: 'tqStatus', type: 'string' },
      { header: 'Path', field: 'path', type: 'string' },
      { header: 'Work Flow', field: 'workflow', type: 'string' },
      { header: 'Current Step', field: 'currentStep', type: 'string' },
      { header: 'Ssize', field: 'ssize', type: 'string' },
      { header: 'Transmitted', field: 'isTransmitted', type: 'checkbox' },
      { header: 'SStatus', field: 'sstatus', type: 'string' },
      { header: 'Confidential', field: 'confidential', type: 'checkbox' },
      {
        header: 'Additional Reference',
        field: 'additionalReference',
        type: 'string',
      },
      { header: 'Review Status', field: 'reviewStatus', type: 'string' },
      { header: 'Model Reference', field: 'modelReference', type: 'string' },
      { header: 'Created By', field: 'createdBy', type: 'string' },
      { header: 'Date Modified', field: 'dateModified', type: 'date' },
      { header: 'Related Items', field: 'relatedItems', type: 'string' },
      { header: 'Access Level', field: 'accessLevel', type: 'string' },
      { header: 'Csi Spec Code', field: 'csiSpecCode', type: 'string' },
      { header: 'Current', field: 'current', type: 'string' },
      { header: 'Facility Code', field: 'facilityCode', type: 'string' },
      { header: 'File Name', field: 'fileName', type: 'string' },
      {
        header: 'Forecast Subm To Client',
        field: 'forecastSubmToClient',
        type: 'date',
      },
      { header: 'Job Number', field: 'jobNumber', type: 'string' },
      { header: 'Lock', field: 'lock', type: 'checkbox' },
      { header: 'Last Modified Date', field: 'lastModifiedDate', type: 'date' },
      { header: 'Milestone', field: 'milestone', type: 'string' },
      { header: 'No Of Markups', field: 'numberOfMarkups', type: 'number' },
      { header: 'Activity Id', field: 'activityId', type: 'string' },
      {
        header: 'Planned Submit Date',
        field: 'plannedSubmissionDate',
        type: 'date',
      },
      { header: 'Print Size', field: 'printSize', type: 'string' },
      { header: 'Purchase Order', field: 'purchaseOrder', type: 'string' },
      { header: 'Remarks', field: 'remarks', type: 'string' },
      { header: 'Review Source', field: 'reviewSource', type: 'string' },
      { header: 'Files Type', field: 'filesType', type: 'dropdown' },
      { header: 'Documents Type', field: 'documentsType', type: 'dropdown' },
      {
        header: 'Documents Sub Type',
        field: 'documentsSubType',
        type: 'dropdown',
      },
      { header: 'Orgnizer', field: 'orgnizer', type: 'dropdown' },
      { header: 'Recipients', field: 'recipient', type: 'dropdown' },
      { header: 'Accptance Code', field: 'accptanceCode', type: 'dropdown' },
      { header: 'Categories', field: 'categories', type: 'dropdown' },
      { header: 'Sub System', field: 'subSystem', type: 'dropdown' },
    ];

    if (sessionStorage.getItem('documentProperties')) {
      let uploadedDocument = [
        ...JSON.parse(sessionStorage.getItem('documentProperties')),
      ];
      this.documentForm = [];

      for (let i = 0; i < uploadedDocument.length; i++) {
        let fileDetails = {
          documentsNumber: uploadedDocument[i][0],
          revision: uploadedDocument[i][1],
          revisionDate: uploadedDocument[i][2],
          version: uploadedDocument[i][3],
          fileType: uploadedDocument[i][4],
          title: uploadedDocument[i][5],
          phase: uploadedDocument[i][6],
          classes: uploadedDocument[i][7],
          documentsFor: uploadedDocument[i][8],
          initiatedBy: uploadedDocument[i][9],
          disciplines: uploadedDocument[i][10],
          receiveDate: uploadedDocument[i][11],
          replyRequired: uploadedDocument[i][12],
          replyRequiredBy: uploadedDocument[i][13],
          repliedDate: uploadedDocument[i][14],
          tqStatus: uploadedDocument[i][15],
          path: uploadedDocument[i][16],
          workflow: uploadedDocument[i][17],
          currentStep: uploadedDocument[i][18],
          ssize: uploadedDocument[i][19],
          isTransmitted: uploadedDocument[i][20],
          sstatus: uploadedDocument[i][21],
          confidential: uploadedDocument[i][22],
          additionalReference: uploadedDocument[i][23],
          reviewStatus: uploadedDocument[i][24],
          modelReference: uploadedDocument[i][25],
          createdBy: uploadedDocument[i][26],
          dateModified: uploadedDocument[i][27],
          relatedItems: uploadedDocument[i][28],
          accessLevel: uploadedDocument[i][29],
          csiSpecCode: uploadedDocument[i][30],
          current: uploadedDocument[i][31],
          facilityCode: uploadedDocument[i][32],
          fileName: uploadedDocument[i].name,
          forecastSubmToClient: uploadedDocument[i][33],
          jobNumber: uploadedDocument[i][34],
          lock: uploadedDocument[i][35],
          lastModifiedDate: uploadedDocument[i][36],
          milestone: uploadedDocument[i][37],
          numberOfMarkups: uploadedDocument[i][38],
          activityId: uploadedDocument[i][39],
          plannedSubmissionDate: uploadedDocument[i][40],
          printSize: uploadedDocument[i][41],
          purchaseOrder: uploadedDocument[i][42],
          remarks: uploadedDocument[i][43],
          reviewSource: uploadedDocument[i][44],
          documentsType: uploadedDocument[i][45],
          documentsSubType: uploadedDocument[i][46],
          orgnizer: uploadedDocument[i][47],
          recipient: uploadedDocument[i][48],
          accptanceCode: uploadedDocument[i][49],
          categories: uploadedDocument[i][50],
          subSystem: uploadedDocument[i][51],
        };
        this.documentForm.push(fileDetails);
      }
    } else if (sessionStorage.getItem('docList')) {
      let uploadedDocument = [...JSON.parse(sessionStorage.getItem('docList'))];
      this.documentForm = [];

      for (let i = 0; i < uploadedDocument.length; i++) {
        let fileDetails = {
          documentsNumber: uploadedDocument[i]?.docno,
          revision: null,
          revisionDate: null,
          version: null,
          fileType: uploadedDocument[i].type,
          title: null,
          phase: null,
          classes: null,
          documentsFor: null,
          initiatedBy: null,
          disciplines: null,
          receiveDate: null,
          replyRequired: null,
          replyRequiredBy: null,
          repliedDate: null,
          tqStatus: null,
          path: null,
          workflow: null,
          currentStep: null,
          ssize: null,
          isTransmitted: null,
          sstatus: null,
          confidential: null,
          additionalReference: null,
          reviewStatus: null,
          modelReference: null,
          createdBy: null,
          dateModified: null,
          relatedItems: null,
          accessLevel: null,
          csiSpecCode: null,
          current: null,
          facilityCode: null,
          fileName: uploadedDocument[i].name,
          forecastSubmToClient: null,
          jobNumber: null,
          lock: null,
          lastModifiedDate: null,
          milestone: null,
          numberOfMarkups: null,
          activityId: null,
          plannedSubmissionDate: null,
          printSize: null,
          purchaseOrder: null,
          remarks: null,
          reviewSource: null,
          documentsType: null,
          documentsSubType: null,
          orgnizer: null,
          recipient: null,
          accptanceCode: null,
          categories: null,
          subSystem: null,
        };

        this.documentForm.push(fileDetails);
      }
    } else {
      this.documentForm = [];
    }

    this.getReferenceTablesData();
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
  }

  async deleteDocument(document: any) {
    const confirm = await this.utilitiesService.confirmDialog(
      'Are you sure to delete?'
    );
    if (confirm) {
      this.documentForm = this.documentForm.filter((doc) => {
        return doc.documentsNumber !== document.documentsNumber;
      });
      this.saveDataInSessionStorage();
    }
  }

  getReferenceTablesData() {
    this.getDocumentsTypesReferenceTable();
  }
  // getDocumentsStatusReferenceTable() {
  //   this.subscriptions.add(
  //     this.apiService.get(ApiURL.statuses).subscribe({
  //       next: (res) => {
  //         this.statusesRefs = res;
  //       },
  //       complete: () => {
  //         this.getDocumentsTypesReferenceTable();
  //       },
  //       error(err) { },
  //     })
  //   );
  // }

  async getDocumentsTypesReferenceTable() {
    try {
      await this.apiService.get(ApiURL.documents_types).subscribe({
        next: (res) => {
          this.documentTypeRefs = res;
        },
        complete: () => {
          this.getDocumentsSubSystemsReference();
        },
        error(err) {},
      });
    } catch (err) {}
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

  exportDocument() {
    this.documentForm = [
      {
        documentsNumber: null,
        revision: null,
        revisionDate: null,
        version: null,
        fileType: null,
        title: null,
        phase: null,
        classes: null,
        documentsFor: null,
        initiatedBy: null,
        disciplines: null,
        receiveDate: null,
        replyRequired: null,
        replyRequiredBy: null,
        repliedDate: null,
        tqStatus: null,
        path: null,
        workflow: null,
        currentStep: null,
        ssize: null,
        isTransmitted: null,
        sstatus: null,
        confidential: null,
        additionalReference: null,
        reviewStatus: null,
        modelReference: null,
        createdBy: null,
        dateModified: null,
        relatedItems: null,
        accessLevel: null,
        csiSpecCode: null,
        current: null,
        facilityCode: null,
        fileName: null,
        forecastSubmToClient: null,
        jobNumber: null,
        lock: null,
        lastModifiedDate: null,
        milestone: null,
        numberOfMarkups: null,
        activityId: null,
        plannedSubmissionDate: null,
        printSize: null,
        purchaseOrder: null,
        remarks: null,
        reviewSource: null,
        documentsType: null,
        documentsSubType: null,
        orgnizer: null,
        recipient: null,
        accptanceCode: null,
        categories: null,
        subSystem: null,
      },
    ];
    this.utilitiesService.exportAsExcelFile(
      this.documentForm,
      'Document-Properties'
    );
    this.documentForm = [];
  }

  selectOptionsArrayforEditDocument(fieldName: string): any {
    switch (fieldName) {
      case 'documentsType':
        return this.documentTypeRefs;
        break;
      case 'documentsSubType':
        return this.documentSubTypeRefs;
        break;
      case 'orgnizer':
        return this.organizerIdRefs;
        break;
      case 'recipient':
        return this.recipientIdRefs;
        break;
      case 'accptanceCode':
        return this.acceptanceCodeRefs;
        break;
      case 'categories':
        return this.categoriesIdRefs;
        break;
      case 'subSystem':
        return this.subSystemIdRefs;
        break;
      case 'filesType':
        return this.filesTypeRefs;
        break;
      default:
        break;
    }
  }

  onFileChange(event: any): void {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      setTimeout(async () => {
        this.addMissingDocuments(data.length);
        this.populateDocumentInputFields(data);
      }, 10);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  populateDocumentInputFields(data: any) {
    console.log(data);
    this.saveDataInSessionStorage();
    for (let i = 1; i < data.length; i++) {
      this.documentForm[i - 1].documentsNumber = data[i][0];
      this.documentForm[i - 1].revision =
        data[i][1] == undefined ? null : data[i][1];
      this.documentForm[i - 1].revisionDate =
        this.convertExcelDateToJSDate(data[i][2]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][2]);
      this.documentForm[i - 1].version =
        data[i][3] == undefined ? null : data[i][3];
      this.documentForm[i - 1].fileType =
        data[i][4] == undefined ? null : data[i][4];
      this.documentForm[i - 1].title =
        data[i][5] == undefined ? null : data[i][5];
      this.documentForm[i - 1].phase =
        data[i][6] == undefined ? null : data[i][6];
      this.documentForm[i - 1].classes =
        data[i][7] == undefined ? null : data[i][7];
      this.documentForm[i - 1].documentsFor =
        data[i][8] == undefined ? null : data[i][8];
      this.documentForm[i - 1].initiatedBy =
        data[i][9] == undefined ? null : data[i][9];
      this.documentForm[i - 1].disciplines =
        data[i][10] == undefined ? null : data[i][10];
      this.documentForm[i - 1].receiveDate =
        this.convertExcelDateToJSDate(data[i][11]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][11]);
      this.documentForm[i - 1].replyRequired =
        data[i][12] == undefined ? null : data[i][12];
      this.documentForm[i - 1].replyRequiredBy =
        this.convertExcelDateToJSDate(data[i][13]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][13]);
      this.documentForm[i - 1].repliedDate =
        this.convertExcelDateToJSDate(data[i][14]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][14]);
      this.documentForm[i - 1].tqStatus =
        data[i][15] == undefined ? null : data[i][15];
      this.documentForm[i - 1].path = localStorage.getItem('filePath');
      this.documentForm[i - 1].workflow =
        data[i][17] == undefined ? null : data[i][17];
      this.documentForm[i - 1].currentStep =
        data[i][18] == undefined ? null : data[i][18];
      this.documentForm[i - 1].ssize =
        data[i][19] == undefined ? null : data[i][19];
      this.documentForm[i - 1].isTransmitted =
        data[i][20] == undefined ? null : data[i][20];
      this.documentForm[i - 1].sstatus =
        data[i][21] == undefined ? null : data[i][21];
      this.documentForm[i - 1].confidential =
        data[i][22] == undefined ? null : data[i][22];
      this.documentForm[i - 1].additionalReference =
        data[i][23] == undefined ? null : data[i][23];
      this.documentForm[i - 1].reviewStatus =
        data[i][24] == undefined ? null : data[i][24];
      this.documentForm[i - 1].modelReference =
        data[i][25] == undefined ? null : data[i][25];
      this.documentForm[i - 1].createdBy = this.currentUser?.name;
      this.documentForm[i - 1].dateModified = new Date();
      this.documentForm[i - 1].relatedItems =
        data[i][28] == undefined ? null : data[i][28];
      this.documentForm[i - 1].accessLevel =
        data[i][29] == undefined ? null : data[i][29];
      this.documentForm[i - 1].csiSpecCode =
        data[i][30] == undefined ? null : data[i][30];
      this.documentForm[i - 1].current =
        data[i][31] == undefined ? null : data[i][31];
      this.documentForm[i - 1].facilityCode =
        data[i][32] == undefined ? null : data[i][32];
      this.documentForm[i - 1].fileName =
        data[i][33] == undefined ? null : data[i][33];
      this.documentForm[i - 1].forecastSubmToClient =
        this.convertExcelDateToJSDate(data[i][34]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][34]);
      this.documentForm[i - 1].jobNumber =
        data[i][35] == undefined ? null : data[i][35];
      this.documentForm[i - 1].lock =
        data[i][36] == undefined ? null : data[i][36];
      this.documentForm[i - 1].lastModifiedDate =
        this.convertExcelDateToJSDate(data[i][37]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][37]);
      this.documentForm[i - 1].milestone =
        data[i][38] == undefined ? null : data[i][38];
      this.documentForm[i - 1].numberOfMarkups =
        data[i][39] == undefined ? null : data[i][39];
      this.documentForm[i - 1].activityId =
        data[i][40] == undefined ? null : data[i][40];
      this.documentForm[i - 1].plannedSubmissionDate =
        this.convertExcelDateToJSDate(data[i][41]).toDateString() ==
        'Invalid Date'
          ? null
          : this.convertExcelDateToJSDate(data[i][41]);
      this.documentForm[i - 1].printSize =
        data[i][42] == undefined ? null : data[i][42];
      this.documentForm[i - 1].purchaseOrder =
        data[i][43] == undefined ? null : data[i][43];
      this.documentForm[i - 1].remarks =
        data[i][44] == undefined ? null : data[i][44];
      this.documentForm[i - 1].reviewSource =
        data[i][45] == undefined ? null : data[i][45];
      // this.documentForm[i - 1].filesTypeId = this.findOptionByName(
      //   data[i][4],
      //   this.filesTypeRefs
      // );
      // this.documentForm[i - 1].documentsType = this.findOptionByName(
      //   data[i][46],
      //   this.documentTypeRefs
      // );
      // this.documentForm[i - 1].documentsSubType = this.findOptionByName(
      //   data[i][47],
      //   this.documentSubTypeRefs
      // );
      // this.documentForm[i - 1].orgnizer = this.findOptionByName(
      //   data[i][48],
      //   this.organizerIdRefs
      // );

      // this.documentForm[49].recipient = this.findOptionByName(
      //   data[49],
      //   this.recipientIdRefs
      // );
      // this.documentForm[i - 1].accptanceCode = this.findOptionByName(
      //   data[i][50],
      //   this.acceptanceCodeRefs
      // );
      // this.documentForm[i - 1].categories = this.findOptionByName(
      //   data[i][51],
      //   this.categoriesIdRefs
      // );
      // this.documentForm[i - 1].subSystem = this.findOptionByName(
      //   data[i][52],
      //   this.subSystemIdRefs
      // );
    }
  }

  findOptionByName(name: string, options: any[]): any {
    console.log(name);
    console.log(options);

    const foundOption = options.find((option) => option.name === name);
    console.log(foundOption);

    return foundOption ? foundOption : null;
  }

  convertExcelDateToJSDate(excelDateSerial: number): Date {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const excelStartDate = new Date('1899-12-30T00:00:00Z');
    const jsDate = new Date(
      excelStartDate.getTime() + excelDateSerial * millisecondsInOneDay
    );
    return jsDate;
  }

  // getFileExtension(fileName: string): string | null {
  //   const lastDotIndex = fileName.lastIndexOf('.');
  //   if (lastDotIndex === -1) {
  //     return null; // No file extension found
  //   }

  //   const extension = fileName.slice(lastDotIndex + 1);
  //   return extension.toUpperCase(); // Convert to lowercase for consistency
  // }

  saveDataInSessionStorage() {
    sessionStorage.setItem(
      'documentProperties',
      JSON.stringify(this.documentForm)
    );
  }

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  prevPage() {
    if (localStorage.getItem('docUpload')) {
      this.router.navigate(['documents/libraries/document-upload']);
    } else {
      this.router.navigate(['documents/libraries/document-numbering']);
    }
  }

  closeDialog() {
    this.saveDataInSessionStorage();

    const documentBody = { ...this.documentForm };
    if (!this.isEditedDocument) {
      documentBody.revision = '';
      documentBody.revisionDate = null;
      documentBody.version = '';
    }
    documentBody.path = localStorage.getItem('filePath');
    this.treeDataSourceService.isClosedNewFileDialog.next(documentBody);
  }

  onRowEditInit() {
    this.editingTable = true;
  }

  onRowEditSave() {
    this.editingTable = false;
    this.isEditedDocument = true;
    this.saveDataInSessionStorage();
  }

  onRowDelete(document: any) {
    console.log(document);
    let docs = JSON.parse(sessionStorage.getItem('docList')) as Array<any>;
    docs = docs.filter((doc) => {
      return doc.docno !== document.documentsNumber;
    });
    sessionStorage.removeItem('docList');
    sessionStorage.setItem('docList', JSON.stringify(docs));

    console.log(JSON.parse(sessionStorage.getItem('docList')));
  }

  onRowEditCancel() {
    this.editingTable = false;
  }

  addMissingDocuments(cnt: number) {
    for (let i = this.documentForm.length; i < cnt - 1; i++) {
      let fileDetails = {
        documentsNumber: null,
        revision: null,
        revisionDate: null,
        version: null,
        fileType: 'OTHER',
        title: null,
        phase: null,
        classes: null,
        documentsFor: null,
        initiatedBy: null,
        disciplines: null,
        receiveDate: null,
        replyRequired: null,
        replyRequiredBy: null,
        repliedDate: null,
        tqStatus: null,
        path: null,
        workflow: null,
        currentStep: null,
        ssize: null,
        isTransmitted: null,
        sstatus: null,
        confidential: null,
        additionalReference: null,
        reviewStatus: null,
        modelReference: null,
        createdBy: null,
        dateModified: null,
        relatedItems: null,
        accessLevel: null,
        csiSpecCode: null,
        current: null,
        facilityCode: null,
        fileName: null,
        forecastSubmToClient: null,
        jobNumber: null,
        lock: null,
        lastModifiedDate: null,
        milestone: null,
        numberOfMarkups: null,
        activityId: null,
        plannedSubmissionDate: null,
        printSize: null,
        purchaseOrder: null,
        remarks: null,
        reviewSource: null,
        documentsType: null,
        documentsSubType: null,
        orgnizer: null,
        recipient: null,
        accptanceCode: null,
        categories: null,
        subSystem: null,
      };

      this.documentForm.push(fileDetails);
    }
  }
}
