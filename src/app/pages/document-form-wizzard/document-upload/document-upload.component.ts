import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TreeDataSourceService } from 'src/app/core/services/tree-datasource.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import * as XLSX from 'xlsx';

interface docsList {
  name?: string;
  type?: string;
  size?: string;
  filename?: string;
  docno?: string;
}

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent implements OnInit {
  documentsList: docsList[] = [];
  docMissMessage: string = '';
  submitted: boolean = false;
  // @ViewChild('saveStorageButton') saveStorageButton: ElementRef;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private treeDataSourceService: TreeDataSourceService
  ) {}

  ngOnInit(): void {
    const docListExists = sessionStorage.getItem('docList');

    if (docListExists) {
      this.documentsList = JSON.parse(sessionStorage.getItem('docList'));
    }
  }

  async nextPage() {
    sessionStorage.removeItem('documentFormData');
    let valueMissing: boolean = false;
    this.submitted = true;

    if (this.documentsList.length == 0) {
      const confirm = await this.utilitiesService.confirmDialog(
        'Document(s) not uploaded, do you want to continue?'
      );
      if (!confirm) {
        return;
      }
    }

    if (!valueMissing) {
      if (this.documentsList.length == 0) {
        localStorage.setItem('docUpload', 'NONE');
        sessionStorage.removeItem('docList');
        sessionStorage.removeItem('docNumber');
        this.router.navigate(['documents/libraries/document-multiple']);
      } else {
        localStorage.removeItem('docUpload');
        await this.saveDocNumber();
        this.router.navigate(['documents/libraries/document-numbering']);
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Fill All Required Fields',
      });
    }
  }

  saveDocNumber() {
    sessionStorage.setItem('docList', JSON.stringify(this.documentsList));
  }

  saveFileToSessionStorage(event: any): void {
    console.log(event);
    let documentProperties = [];
    if (event.files) {
      event.files.forEach((file) => {
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // Push all rows except the first one (header row)
            for (let i = 1; i < data.length; i++) {
              documentProperties.push(data[i]);
            }
            console.log(documentProperties);
            this.saveDataInSessionStorage(documentProperties);
          } catch (error) {
            console.error('Error reading file:', error);
          }
        };
        reader.readAsBinaryString(file);
      });
    }
  }

  saveDataInSessionStorage(data: any) {
    console.log(data);
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem('documentProperties', serializedData);
  }

  onFileUpload(event: any, fileUpload: any) {
    this.saveFileToSessionStorage(event);
    let fileName: string = '';
    let fileType: string = '';
    for (const file of event.files) {
      //remove file extension
      const parts = file.name.split('.');
      fileName = parts[0];
      fileType = this.getFileType(parts[1]);
      console.log(file);

      let fileDetails = {
        name: file.name,
        type: fileType,
        size: this.transformFileSize(file.size, 1),
        filename: fileName,
        docno: fileName,
        data: file,
      };
      this.documentsList.push(fileDetails);
    }
    this.treeDataSourceService.filesToUpload.next(this.documentsList);

    fileUpload.clear();

    if (this.documentsList.length > 0) {
      this.docMissMessage = '';
    }

    if (this.documentsList.length > 1) {
      this.docMissMessage = '';
    }
  }

  async deleteDocument(i: number, rowID: number) {
    const confirm = await this.utilitiesService.confirmDialog(
      'Are you sure to delete?'
    );
    if (confirm) {
      this.documentsList.splice(i, 1);
      if (this.documentsList.length <= 0) {
        sessionStorage.removeItem('docList');
      }
    }
  }

  prevPage() {
    // this.visible = true;
    // this.router.navigate(['documents/document-upload']);
  }

  transformFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getFileType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'IMAGE';
      case 'pdf':
        return 'PDF';
      case 'doc':
      case 'docx':
        return 'WORD';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'EXCEL';
      case 'dwg':
        return 'DWG';
      default:
        return 'OTHER';
    }
  }
}
