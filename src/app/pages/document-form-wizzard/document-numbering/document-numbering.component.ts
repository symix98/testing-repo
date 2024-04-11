import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

interface docs {
  documentname?: string;
  documenttype?: string;
  samesequenceno?: boolean;
  autonumber?: boolean;
  complexno?: string;
  originatorno?: string;
  disciplineno?: string;
  disciplinecodeno?: string;
  unitno?: string;
  doctypeno?: string;
  areacodeno?: string;
  sequenceno?: string;
  subsequenceno?: string;
  editsequenceno?: boolean;
}

interface docsList {
  name?: string;
  type?: boolean;
  size?: string;
  filename?: string;
  docno?: string;
}


@Component({
  selector: 'app-document-numbering',
  templateUrl: './document-numbering.component.html',
  styleUrls: ['./document-numbering.component.scss'],
})
export class DocumentNumbering implements OnInit {
  submitted: boolean = false;
  isAutoNumber: boolean = false;
  documentType: any[] = [];
  documentsList: docsList[] = [];
  isContEngDoc: boolean = false;
  isContSubconDoc: boolean = false;
  isCompSubconDoc: boolean = false;
  isIsometrics: boolean = false;
  isSameSeqNo: boolean = false
  isAllowSeqNoEdit: boolean = false

  docOriginatorList: any[] = [];
  docDisciplineList: any[] = [];
  docUnitList: any[] = [];
  docTypeList: any[] = [];
  docDisciplineCodeList: any[] = [];
  docAreaCodeList: any[] = [];

  docNoTemp: string = ""

  nextSequenceNo: number = 0;
  nextSubSequenceNo: number = 0;

  documentForm: docs = {
    documentname: '',
    documenttype: '',
    samesequenceno: false,
    autonumber: false,
    complexno: 'Q7',
    originatorno: '',
    disciplineno: '',
    disciplinecodeno: '',
    unitno: '',
    doctypeno: '',
    areacodeno: '',
    sequenceno: '',
    subsequenceno: '',
    editsequenceno: false
  };

  constructor(public messageService: MessageService,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private ApiService: ApiService) { }

  ngOnInit() {
    this.documentType = [
      { label: 'EPCC Contractor - Engineering Documents', value: 'EPCC Contractor - Engineering Documents' },
      { label: 'EPCC Contractor - Subcontractor Documents', value: 'EPCC Contractor - Subcontractor Documents' },
      { label: 'Company - Subcontractor Documents', value: 'Company - Subcontractor Documents' },
      { label: 'Isometrics', value: 'Isometrics' },
    ];

    const docExists = sessionStorage.getItem('docNumber')
    const docFileExists = sessionStorage.getItem('docList')
    this.documentsList = JSON.parse(sessionStorage.getItem('docList'));

    if (docExists) {
      this.documentForm = null;
      this.documentForm = JSON.parse(sessionStorage.getItem('docNumber'));
      this.getDocNoProperties()

      this.isAutoNumber = this.documentForm.autonumber
    } else {
      // if (docFileExists) {
      //   if (this.documentsList.length > 1) {
      //     this.isAutoNumber = true;
      //     this.documentForm.autonumber = true;
      //   } else {
      //     this.documentForm.documentname = this.documentsList[0].filename
      //   }
      // }
    }

    if (this.documentForm.documenttype == "Company - Subcontractor Documents") {
      this.getDocDisciplinesRef("COMPANY");
    } else {
      this.getDocDisciplinesRef("ENGINEERING");
    }

    this.getDocOrganizerRef();
    this.getDocTypeRef();
    this.getDocAreaRef();
    this.getDocSubAreaRef();
  }

  saveArrayToSessionStorage(key: string, array: any[]): void {
    sessionStorage.setItem(key, JSON.stringify(array));
  }

  prevPage() {
    this.router.navigate(['documents/libraries/document-upload']);
  }

  nextPage() {
    let valueMissing: boolean = false;
    this.submitted = true;
    this.addNumbersToDocList()
    // if (this.documentForm.autonumber) {
    //   if (this.documentForm.documentname &&
    //     this.documentForm.complexno &&
    //     this.documentForm.originatorno) {

    //     valueMissing = true;
    //   }
    // } else if (!this.documentForm.autonumber) {
    //   if (this.documentForm.documentname) {
    //     valueMissing = true;
    //   }
    // }

    for (let i = 0; i < this.documentsList.length; i++) {
      if (this.documentsList[i].docno == "") {
        valueMissing = true;
      }
    }

    if (valueMissing == false) {
      // this.router.navigate(['documents/libraries/document-properties']);
      this.router.navigate(['documents/libraries/document-multiple'])
    } else {
      this.messageService.add({ severity: 'error', summary: 'Fill All Required Fields/Document No Missing!' });
    }

    this.saveDocNumber();
    
  }

  addNumbersToDocList(){
    
    let docs:any[] = JSON.parse(sessionStorage.getItem('docList'));
    if(docs) {
      for (let i = 0; i < docs.length; i++) {

        docs[i].docno = this.documentsList[i].docno
    }
    sessionStorage.setItem("docList",JSON.stringify(docs));
    }
    
}

  saveDocNumber() {
    if (this.documentForm.autonumber) { this.generateDocumentNo(); }

    sessionStorage.setItem('docNumber', JSON.stringify(this.documentForm));

    // this.apiService.post(ApiURL.document_number, this.documentForm).subscribe(res => {
    // }, (err) => {
    //   this.utilitiesService.notifyError(err.error.title)
    // })
  }

  showAutoNumber() {
    this.isAutoNumber = !this.isAutoNumber;

    this.generateDocumentNo();
    // if (!this.isAutoNumber) { this.isSameSeqNo = false; }
  }

  showSubSequenceNo() {
    this.isSameSeqNo = !this.isSameSeqNo;

    if (!this.isSameSeqNo) {
      this.isAllowSeqNoEdit = false;
      this.documentForm.editsequenceno = false;
    }
    this.generateDocumentNo();
  }

  allowSequenceNoEdit() {
    this.isAllowSeqNoEdit = !this.isAllowSeqNoEdit;
    this.generateDocumentNo();
  }

  async generateDocumentNo() {
    let docAutoNo: string = ""
    // this.documentForm.sequenceno = ""
    // this.documentForm.subsequenceno = ""
    this.docNoTemp = "";

    for (let i = 0; i < this.documentsList.length; i++) {
      if (this.isAutoNumber) {
        this.documentsList[i].docno = ""
      } else {
        this.documentForm.sequenceno = ""
        this.documentsList[i].docno =this.documentsList[i].filename
      }
    }

    if (this.documentForm.documenttype == "EPCC Contractor - Engineering Documents") {
      if (this.documentForm.originatorno) { docAutoNo += this.documentForm.originatorno }
      if (this.documentForm.disciplineno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.disciplineno : "" + this.documentForm.disciplineno }
      if (this.documentForm.unitno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.unitno : "" + this.documentForm.unitno }
      if (this.documentForm.doctypeno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.doctypeno : "" + this.documentForm.doctypeno }

    } else if (this.documentForm.documenttype == "EPCC Contractor - Subcontractor Documents") {
      if (this.documentForm.originatorno) { docAutoNo += this.documentForm.originatorno }
      if (this.documentForm.disciplineno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.disciplineno : "" + this.documentForm.disciplineno }
      if (this.documentForm.unitno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.unitno : "" + this.documentForm.unitno }
      if (this.documentForm.doctypeno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.doctypeno : "" + this.documentForm.doctypeno }

    } else if (this.documentForm.documenttype == "Company - Subcontractor Documents") {
      if (this.documentForm.complexno) { docAutoNo += this.documentForm.complexno }
      if (this.documentForm.originatorno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.originatorno : "" + this.documentForm.originatorno }
      if (this.documentForm.doctypeno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.doctypeno : "" + this.documentForm.doctypeno }
      if (this.documentForm.disciplinecodeno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.disciplinecodeno : "" + this.documentForm.disciplinecodeno }
      if (this.documentForm.areacodeno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.areacodeno : "" + this.documentForm.areacodeno }

    } else if (this.documentForm.documenttype == "Isometrics") {
      if (this.documentForm.complexno) { docAutoNo += this.documentForm.complexno }
      if (this.documentForm.originatorno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.originatorno : "" + this.documentForm.originatorno }
      if (this.documentForm.disciplineno) { docAutoNo += docAutoNo.length > 0 ? "-" + this.documentForm.disciplineno : "" + this.documentForm.disciplineno }
      if (this.documentForm.areacodeno) { docAutoNo += docAutoNo.length > 0 ? "-D6" + this.documentForm.areacodeno : "D6" + this.documentForm.areacodeno }
    }

    this.docNoTemp = docAutoNo;
    let seqNo: any = ""
    if (this.isAllowSeqNoEdit) {
      seqNo = this.documentForm.sequenceno;

    } else {
      setTimeout(async () => {
        await this.getNextSequenceNo(docAutoNo, "SEQUENCE");
        seqNo = parseInt(this.documentForm.sequenceno);

      }, 30);
    }

    this.documentForm.documentname = docAutoNo;
    this.documentForm.autonumber = this.isAutoNumber

    let newDocNo: string = ""
    let newSubSeqDocNo: string = ""
    let subSeqNo: number = 0

    setTimeout(async () => {
      if (this.isAllowSeqNoEdit) {
        newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo : "" + seqNo
      } else {
        newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo.toString().padStart(5, "0") : "" + seqNo.toString().padStart(5, "0")
      }

      await this.getNextSequenceNo(newDocNo, "SUBSEQUENCE");
      subSeqNo = parseInt(this.documentForm.subsequenceno);
    }, 20);


    // for (let i = 0; i < this.documentsList.length; i++) {
    //   newDocNo = "";
    //   newSubSeqDocNo = "";

    //   if (this.documentForm.autonumber) {
    //     if (this.documentForm.samesequenceno) {
    //       if (this.isAllowSeqNoEdit) {
    //         newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo : "" + seqNo
    //       } else {
    //         newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo.toString().padStart(5, "0") : "" + seqNo.toString().padStart(5, "0")
    //       }

    //       // newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo.toString().padStart(5, "0") : "" + seqNo.toString().padStart(5, "0")
    //       newSubSeqDocNo = newDocNo.length > 0 ? newDocNo + "-" + subSeqNo.toString().padStart(3, "0") : "" + subSeqNo.toString().padStart(3, "0")

    //       this.documentsList[i].docno = newSubSeqDocNo;
    //       subSeqNo += 1;
    //     } else {
    //       newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo.toString().padStart(5, "0") : "" + ""
    //       this.documentsList[i].docno = newDocNo;
    //       seqNo += 1;
    //     }
    //   } else {
    //     this.documentsList[i].docno = this.documentsList[i].filename;
    //   }
    // }
  }

  async getNextSequenceNo(autono: string, searchtype: string) {
    if (searchtype == 'SEQUENCE') {
      this.nextSequenceNo = 0;

      if (autono.length) {
        let query: ApiQuery = null;
        query = { contains: new Map<string, string>([['documentsNumber', autono]]) }
        query.size = 300000;
        this.ApiService.get(ApiURL.documentss, query).subscribe(res => {
          if (res) {
            this.nextSequenceNo += res.length + 1
            this.documentForm.sequenceno = this.nextSequenceNo.toString()
          } else {
            this.nextSequenceNo = 1;
            this.documentForm.sequenceno = this.nextSequenceNo.toString()
          }
        }, (err) => {
          this.utilitiesService.notifyError(err.error.title)
        })
      }

    } else if (searchtype == 'SUBSEQUENCE') {
      this.nextSubSequenceNo = 0;
      
      if (autono.length) {
        let query: ApiQuery = null;
        query = { contains: new Map<string, string>([['documentsNumber', autono]]) }
        query.size = 300000;
        this.ApiService.get(ApiURL.documentss, query).subscribe(res => {
          if (res) {
            this.nextSubSequenceNo += res.length + 1
            this.documentForm.subsequenceno = this.nextSubSequenceNo.toString()
          } else {
            this.nextSubSequenceNo = 1;
            this.documentForm.subsequenceno = this.nextSubSequenceNo.toString()
          }
        }, (err) => {
          this.utilitiesService.notifyError(err.error.title)
        })
      }
    }
  }

  applyDocumentNo() {

    if (!this.documentForm.sequenceno) {
      this.utilitiesService.notifyError("Invalid/Missing Sequence No!")
      return;
    }

    let newDocNo: string = ""
    let newSubSeqDocNo: string = ""
    let seqNo: number = parseInt(this.documentForm.sequenceno);
    let subSeqNo: number = parseInt(this.documentForm.subsequenceno);

    for (let i = 0; i < this.documentsList.length; i++) {
      newDocNo = "";
      newSubSeqDocNo = "";

      if (this.documentForm.autonumber) {
        if (this.documentForm.samesequenceno) {
          if (this.isAllowSeqNoEdit) {
            newDocNo = this.docNoTemp.length > 0 ? this.docNoTemp + "-" + this.documentForm.sequenceno : "" + this.documentForm.sequenceno
          } else {
            newDocNo = this.docNoTemp.length > 0 ? this.docNoTemp + "-" + seqNo.toString().padStart(5, "0") : "" + seqNo.toString().padStart(5, "0")
          }

          // newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo.toString().padStart(5, "0") : "" + seqNo.toString().padStart(5, "0")
          newSubSeqDocNo = newDocNo.length > 0 ? newDocNo + "-" + subSeqNo.toString().padStart(3, "0") : "" + subSeqNo.toString().padStart(3, "0")

          this.documentsList[i].docno = newSubSeqDocNo;
          subSeqNo += 1;
        } else {

          newDocNo = this.docNoTemp.length > 0 ? this.docNoTemp + "-" + seqNo.toString().padStart(5, "0") : "" + ""
          this.documentsList[i].docno = newDocNo;
          seqNo += 1;
        }
      } else {
        this.documentsList[i].docno = this.documentsList[i].filename;
      }
    }
  }

  getDocNoProperties() {
    this.isContEngDoc = false;
    this.isContSubconDoc = false;
    this.isCompSubconDoc = false;
    this.isIsometrics = false;

    if (this.documentForm.documenttype == "EPCC Contractor - Engineering Documents") {
      this.isContEngDoc = true;
      this.getDocDisciplinesRef("ENGINEERING")
    } else if (this.documentForm.documenttype == "EPCC Contractor - Subcontractor Documents") {
      this.isContSubconDoc = true;
      this.getDocDisciplinesRef("ENGINEERING")
    } else if (this.documentForm.documenttype == "Company - Subcontractor Documents") {
      this.isCompSubconDoc = true;
      this.getDocDisciplinesRef("COMPANY")
    } else if (this.documentForm.documenttype == "Isometrics") {
      this.isIsometrics = true;
    }

    this.generateDocumentNo();
  }

  //reference tables
  getDocOrganizerRef() {
    let query: ApiQuery = new ApiQuery();
    query.size = 300000
    this.ApiService.get(ApiURL.organizer, query).subscribe(res => {
      this.docOriginatorList = res
    })
  }

  getDocDisciplinesRef(category: string) {
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['description', category]])

    this.ApiService.get(ApiURL.discipline_id_refs, query).subscribe(res => {
      this.docDisciplineList = res
    })
  }

  getDocTypeRef() {
    let query: ApiQuery = new ApiQuery();
    query.size = 300000
    this.ApiService.get(ApiURL.documents_types, query).subscribe(res => {
      this.docTypeList = res
    })
  }

  getDocAreaRef() {
    let query: ApiQuery = new ApiQuery();
    query.size = 300000
    this.ApiService.get(ApiURL.area, query).subscribe(res => {
      this.docAreaCodeList = res
    })
  }

  getDocSubAreaRef() {
    let query: ApiQuery = new ApiQuery();
    query.size = 300000
    this.ApiService.get(ApiURL.sub_area, query).subscribe(res => {
      this.docUnitList = res
    })
  }

}
