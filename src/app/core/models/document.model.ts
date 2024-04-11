export class Document {
  id?: number;
  documentsNumber: string = null;
  revision: string = null;
  revisionDate: Date = null;
  version: string = null;
  fileType: string = null;
  title: string = null;
  phase: string = null;
  classes: string = null;
  documentsFor: string = null;
  initiatedBy: string = null;
  disciplines: string = null;
  receiveDate: Date = null;
  replyRequired: string = null;
  replyRequiredBy: Date = null;
  repliedDate: Date = null;
  tqStatus: string = null;
  path: string = null;
  workflow: string = null;
  currentStep: string = null;
  ssize: string = null;
  isTransmitted: boolean = null;
  sstatus: string = null;
  confidential: boolean = null;
  additionalReference: string = null;
  reviewStatus: string = null;
  modelReference: string = null;
  createdBy: string = null;
  dateModified: Date = null;
  relatedItems: string = null;
  accessLevel: string = null;
  csiSpecCode: string = null;
  current: string = null;
  facilityCode: string = null;
  fileName: string = null;
  forecastSubmToClient: Date = null;
  jobNumber: string = null;
  lock: boolean = null;
  lastModifiedDate: Date = null;
  milestone: string = null;
  numberOfMarkups: number = null;
  activityID: string = '';
  plannedSubmissionDate: Date = null;
  printSize: string = null;
  purchaseOrder: string = null;
  remarks: string = null;
  reviewSource: string = null;
  projectField1: string = null;
  projectField2: string = null;
  projectField3: string = null;
  projectField4: string = null;
  projectField5: string = null;
  projectField6: string = null;
  projectField7: string = null;
  
  // filesTypeId: number = null;
  // documentsTypeId: number = null;
  // documentsSubTypeId: number = null;
  // disciplineId: number = null;
  // orgnizerId: number = null;
  // recipientId: number = null;
  // accptanceCodeId: number = null;
  // categoriesId: number = null;
  // subSystemId: number = null;

  filesType: {
    id: number;
    name: string;
    code: string;
    description: string;
  }

  documentsType: {
    id: number;
    name: string;
    code: string;
    description: string;
  }

  documentsSubType: {
    id: number;
    name: string;
    code: string;
    description: string;
  }

  status: {
    id: number;
    name: string;
    code: string;
    description: string;
  }

  discipline: {
    id: number;
    name: string;
    code: string;
    description: string;
  }

  orgnizer: {
    id: number;
    name: string;
    code: string;
    type: string;
    description: string;
  }

  recipient: {
    id: number;
    name: string;
    code: string;
    type: string;
    description: string;
  }

  accptanceCode: {
    id: number;
    number: number;
    name: string;
  }

  categories: {
    id: number;
    number: number;
    name: string;
    targetAcceptNumber: number;
    result: string;
  }

  subSystem: {
    id: 0;
    name: string;
    description: string;
    systemId: number;
  }
  length: any;
}

// export class Document {
//     id?: number;
//     documentsNumber: string;
//     revision: string;
//     revisionDate: Date;
//     version: string;
//     fileType: string;
//     title: string;
//     phase: string;
//     classes: string;
//     documentsFor: string;
//     initiatedBy: string;
//     disciplines: string;
//     receiveDate: Date;
//     replyRequired: string;
//     replyRequiredBy: Date;
//     repliedDate: Date;
//     tqStatus: string;
//     path: string;
//     filesType: object; //dropdown
//     documentsType: object; //dropdown
//     documentsSubType: object; //dropdown
//     discipline: object; //dropdown
//     status: object;
//     orgnizer: object; //dropdown
//     recipient: object; //dropdown
//     accptanceCode: object; //dropdown
//     categories: object; //dropdown
//     subSystem: object;
//     system: object;
//     location:object;
//   }
// document.model.ts