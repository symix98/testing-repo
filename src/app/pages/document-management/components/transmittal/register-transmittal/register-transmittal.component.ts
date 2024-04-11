import { Component, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Transmittal } from 'src/app/core/models/transmittal.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AddDocumentsComponent } from '../../add-documents/add-documents.component';
import { AddRecipientComponent } from '../../add-recipient/add-recipient.component';
import { TransmittalNumbringComponent } from '../transmittal-numbring/transmittal-numbring.component';
import { Router } from '@angular/router';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { EditableRow } from 'primeng/table';
import { previewService } from 'src/app/core/services/preview.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register-transmittal',
  templateUrl: './register-transmittal.component.html',
  styleUrls: ['./register-transmittal.component.scss'],
  providers: [EditableRow],
})
export class RegisterTransmittalComponent implements OnInit {
  transmittal: Transmittal = new Transmittal();
  appUsers: any[] = [];
  currentUser: any;
  transmittalDocuments: any[] = [];
  selectedDocuments: any;
  editingMode: boolean = false;
  pageTitle: string = 'Issue Transmittal';
  clonedAppUsers: { [s: string]: any } = {};
  transmittalNumbering: string;
  isLoading: boolean = false;
  openPdf: boolean = false;
  display: boolean = false;
  pdfurl: any;
  isTransmittalDraft: boolean;
  inboxResponses: any;

  purposes: any[] = [
    { id: 'review', name: 'For Review' },
    { id: 'approval', name: 'For Approval' },
    { id: 'info', name: 'For Information' },
    { id: 'contr', name: 'For Construction' },
    { id: 'design', name: 'For Design' },
    { id: 'est', name: 'For Estimation' },
  ];

  types: any[] = [{ id: 'transmittal', name: 'Transmittal' }];

  constructor(
    private dialogService: DialogService,
    private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private ref: DynamicDialogRef,
    private router: Router,
    public config: DynamicDialogConfig,
    private previewservice: previewService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.editingMode = this.config.data?.editingMode;
    if (this.config.data?.transmittal) {
      this.transmittal = this.config.data.transmittal;
      if (this.transmittal.status === 'draft') {
        this.isTransmittalDraft = true;
      }

      this.pageTitle = 'Edit Transmittal';
      this.populateTransmittalFields();
    }
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    if (this.editingMode) {
      this.getTransmittalRecipients();
      this.getTransmittalDocuments();
      this.getInboxResponses();
    }
  }

  getInboxResponses() {
    const url = `${ApiURL.transmittal_recipients}?transmittalId.equals=${this.transmittal.id}`;
    this.apiService.get(url).subscribe(
      (res: any[]) => {
        this.inboxResponses = res;
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation');
      }
    );
  }

  getTransmittalRecipients() {
    const transmittalId = this.config.data.transmittal.id;
    const url = `${ApiURL.transmittal_recipients}?transmittalId.equals=${transmittalId}`;
    this.apiService.get(url).subscribe(
      (res: any[]) => {
        this.appUsers = res;
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation');
      }
    );
  }

  getTransmittalDocuments() {
    const transmittalId = this.config.data.transmittal.id;
    const url = `${ApiURL.documentss}?transmittalId.equals=${transmittalId}`;
    this.apiService.get(url).subscribe(
      (res) => {
        this.transmittalDocuments = res;
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation');
      }
    );
  }

  private serializeParams(params: any): string {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&');
  }

  populateTransmittalFields() {
    setTimeout(() => {
      if (this.transmittal.purpose) {
        this.transmittal.purpose = this.findOptionByName(
          this.config.data.transmittal.purpose,
          this.purposes
        );
      }
      if (this.transmittal.type) {
        this.transmittal.type = this.findOptionByName(
          this.config.data.transmittal.type,
          this.types
        );
      }
    }, 1);
  }

  findOptionByName(dropdownlistObject: any, options: any[]): any {
    return options.find((option) => option.name === dropdownlistObject);
  }

  addRecipient() {
    this.dialogService
      .open(AddRecipientComponent, {
        header: 'Add Recipient',
        height: 'auto',
        width: '70%',
        styleClass: 'my-dialog-class',
        modal: true,
      })
      .onClose.subscribe((appUsers) => {
        if (appUsers && appUsers.length > 0) {
          for (let i = 0; i < appUsers.length; i++) {
            appUsers[i].isAckRequired = false;
            appUsers[i].isRespRequired = false;
            appUsers[i].ackRequiredDate = null;
            appUsers[i].respRequiredDate = null;
          }
          if (this.appUsers.length <= 0) {
            appUsers.forEach((user) => {
              this.appUsers.push(user);
            });
          } else {
            if (appUsers.length > this.appUsers.length) {
              for (let i = 0; i < appUsers.length; i++) {
                if (
                  this.appUsers[i] &&
                  this.appUsers[i].tRecEmail !== appUsers.email
                ) {
                  this.appUsers.push(appUsers[i]);
                }
              }
            }

            if (appUsers.length < this.appUsers.length) {
              for (let i = 0; i < this.appUsers.length; i++) {
                if (
                  appUsers[i] &&
                  appUsers[i].email !== this.appUsers[i].tRecEmail
                ) {
                  this.appUsers.push(appUsers[i]);
                }
              }
            }
          }
        }
      });
  }

  addDocuments() {
    this.dialogService
      .open(AddDocumentsComponent, {
        header: 'Add Documents',
        height: 'auto',
        width: '95%',
        styleClass: 'my-dialog-class',
        modal: true,
      })
      .onClose.subscribe((docs) => {
        if (docs) {
          this.transmittalDocuments = docs.selected;
        }
      });
  }

  onDocumentRemove(selectedDocument: any) {
    this.transmittalDocuments = this.transmittalDocuments.filter((doc) => {
      return doc.id !== selectedDocument.id;
    });
  }

  onRowEditInit(appUser: any) {}

  onRowEditSave(appUsers: any) {
    if (appUsers.isAckRequired === false) {
      appUsers.ackRequiredDate = null;
    }
    if (appUsers.isRespRequired === false) {
      appUsers.respRequiredDate = null;
    }
    this.appUsers = null;
    this.appUsers = appUsers;
  }

  onRowRemove(recipients) {
    this.apiService
      .delete(ApiURL.transmittal_recipients + '/' + recipients.id)
      .subscribe(
        (res) => {
          this.appUsers = this.appUsers.filter((user) => {
            return user.id !== recipients.id;
          });
          this.utilitiesService.notifySuccess('Recipient Deleted!');
        },
        (err) => {
          this.utilitiesService.notifyError('Could not perform operation');
        }
      );
  }

  onRowEditCancel() {}

  save(savingType: string) {
    this.transmittal.status = savingType;
    let data = {};
    if (this.appUsers.length > 0) {
      if (this.transmittalDocuments.length > 0) {
        data = {
          transmittal: this.transmittal,
          appUsers: this.appUsers,
          selectedDocuments: this.transmittalDocuments,
          mode: 'fullData',
        };
      } else {
        data = {
          transmittal: this.transmittal,
          appUsers: this.appUsers,
          mode: 'appUsersOnly',
        };
      }
    } else {
      if (this.transmittalDocuments.length > 0) {
        data = {
          transmittal: this.transmittal,
          selectedDocuments: this.transmittalDocuments,
          mode: 'documentsOnly',
        };
      } else {
        data = {
          transmittal: this.transmittal,
          mode: 'transmittalOnly',
        };
      }
    }
    this.dialogService
      .open(TransmittalNumbringComponent, {
        header: 'Transmittal Number',
        height: '38vh',
        width: '50%',
        modal: true,
        data,
      })
      .onClose.subscribe((res) => {
        if (res === true) {
          this.ref.close(true);
          this.router.navigate(['documents/transmittal']);
        }
      });
  }

  removeAppUser(userID: any) {
    this.appUsers = this.appUsers.filter((user) => user.userId !== userID);
  }

  backToTransmittalMainPage() {
    const currentUrl = this.router.url;
    if (!this.editingMode) {
      this.router.navigate(['documents/transmittal']);
    }
  }

  PreviewForm(id: any) {
    this.isLoading = true;
    this.previewservice
      .getjasperReport('pdf', id)
      .subscribe((response: any) => {
        let filename = 'Preview-report';
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        this.pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(
          downloadLink.href
        );
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
        this.display = true;
        this.openPdf = true;
        this.isLoading = false;
      });
  }
}
