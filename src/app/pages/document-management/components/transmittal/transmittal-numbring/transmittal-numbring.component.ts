import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Transmittal } from 'src/app/core/models/transmittal.model';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { AppUsers } from 'src/app/core/models/app-users.model';

@Component({
  selector: 'app-transmittal-numbring',
  templateUrl: './transmittal-numbring.component.html',
  styleUrls: ['./transmittal-numbring.component.scss'],
})
export class TransmittalNumbringComponent implements OnInit, AfterViewChecked {
  transmittalNumbering: string;
  transmittal: Transmittal;
  recipients: any[] = [];
  selectedDocuments: any[] = [];
  currentUser: any;
  selectedOriginator: string;
  selectedRecipient: string;
  transmittalOriginatorRecipient: any[] = [];
  editingMode: string;
  nextSequenceNo: number = 0;

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.getOriginatorList();
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    this.transmittal = this.config.data?.transmittal;
    this.recipients = this.config.data?.appUsers;
    this.editingMode = this.config.data?.mode;
    this.selectedDocuments = this.config.data?.selectedDocuments;
    console.log(this.recipients);
    console.log(this.selectedDocuments);
    console.log(this.editingMode);

    this.generateDocumentNo();
  }

  getOriginatorList() {
    this.apiService.get(ApiURL.organizer).subscribe((res) => {
      this.transmittalOriginatorRecipient = res;
    });
  }

  async generateDocumentNo() {
    if (this.selectedOriginator && this.selectedRecipient) {
      await this.getNextSequenceNo(
        `T-${this.selectedOriginator}-${this.selectedRecipient}-`
      );

      setTimeout(() => {
        let transmitNo =
          `T-${this.selectedOriginator}-${this.selectedRecipient}-` +
          this.nextSequenceNo.toString().padStart(5, '0');
        // newDocNo = docAutoNo.length > 0 ? docAutoNo + "-" + seqNo.toString().padStart(5, "0") : "" + seqNo.toString().padStart(5, "0")

        // this.transmittalNumbering = `T-${this.selectedOriginator}-${this.selectedRecipient}-0000`;
        this.transmittalNumbering = transmitNo;
      }, 25);
    } else {
      this.transmittalNumbering = '';
    }
  }

    // this.apiService.put(ApiURL.transmittals + '/' + this.transmittal.id, transmittalObject).subscribe({
    //   next: (response) => {
    //   },
    //   error: (err) => {
    //     this.utilitiesService.notifyError(err.error.details);
    //   },
    //   complete: () => {
    //     this.saveTransmittal()
    //   }
    // });

  saveTransmittal() {
    const transmittalObject = {
      projectName: this.transmittal.projectName,
      transmittalNo: this.transmittalNumbering,
      subject: this.transmittal.subject,
      purpose: this.transmittal.purpose['name'],
      comments: this.transmittal.comments,
      creationDate: new Date(),
      ceatedBy: this.currentUser.name,
      status: this.transmittal.status,
      type: this.transmittal.type['name'],
    };
    if (this.editingMode === 'fullData') {
      const transmittalObject = {
        projectName: this.transmittal.projectName,
        transmittalNo: this.transmittalNumbering,
        subject: this.transmittal.subject,
        purpose: this.transmittal.purpose['name'],
        comments: this.transmittal.comments,
        creationDate: new Date(),
        ceatedBy: this.currentUser.name,
        status: this.transmittal.status,
        type: this.transmittal.type['name'],
        documents: this.selectedDocuments,
        transmittalRecipients: this.recipients,
      };
      this.apiService.post(ApiURL.transmittals, transmittalObject).subscribe(
        (res) => {
          this.onClickEmailAction(res, this.recipients);
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
    } else if (this.editingMode === 'documentsOnly') {
      const transmittalObject = {
        projectName: this.transmittal.projectName,
        transmittalNo: this.transmittalNumbering,
        subject: this.transmittal.subject,
        purpose: this.transmittal.purpose['name'],
        comments: this.transmittal.comments,
        creationDate: new Date(),
        ceatedBy: this.currentUser.name,
        status: this.transmittal.status,
        type: this.transmittal.type['name'],
        documents: this.selectedDocuments,
      };
      this.apiService.post(ApiURL.transmittals, transmittalObject).subscribe(
        (res) => {
          this.onClickEmailAction(res, this.recipients);
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
    } else {
      this.apiService.post(ApiURL.transmittals, transmittalObject).subscribe(
        (res) => {
          this.onClickEmailAction(res, this.recipients);
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
    }
  }

  saveTransmittalDocuments(transmittal) {
    transmittal.documents = this.selectedDocuments;
    this.apiService
      .put(ApiURL.transmittals + '/' + transmittal.id, transmittal)
      .subscribe(
        (res) => {
          if (this.recipients) {
            this.saveTransmittalRecipients(transmittal);
          } else {
            this.showMessageAndClose();
          }
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.details);
        }
      );
  }

  saveTransmittalRecipients(transmittal) {
    let id = transmittal.id;
    let transmittalRecipients: any[] = [];
    if (!this.editingMode) {
      for (let i = 0; i < this.recipients.length; i++) {
        if (this.recipients[i].userId) {
          let dateAckRequiredDate = new Date(
            this.recipients[i].ackRequiredDate
          );
          let dateRespRequiredDate = new Date(
            this.recipients[i].respRequiredDate
          );
          dateAckRequiredDate.setHours(dateAckRequiredDate.getHours() + 3);
          dateRespRequiredDate.setHours(dateRespRequiredDate.getHours() + 3);
          transmittalRecipients.push({
            tRecName: this.recipients[i].name,
            tRecEmail: this.recipients[i].email,
            recComp: null,
            recTitle: null,
            isAckRequired: this.recipients[i].isAckRequired,
            isRespRequired: this.recipients[i].isRespRequired,
            acknolgment: null,
            response: null,
            ackDate: null,
            respDate: null,
            ackRequiredDate: dateAckRequiredDate,
            respRequiredDate: dateRespRequiredDate,
            comments: null,
            transmittal: { id },
          });
        }
      }
      this.sendRequestSequentially(transmittalRecipients, 0);
      this.sendInboxRequest(transmittal);
    } else {
      this.recipients.forEach((user) => {
        if (user.id) {
          let dateAckRequiredDate = new Date(user.ackRequiredDate);
          let dateRespRequiredDate = new Date(user.respRequiredDate);
          dateAckRequiredDate.setHours(dateAckRequiredDate.getHours() + 3);
          dateRespRequiredDate.setHours(dateRespRequiredDate.getHours() + 3);
          user.ackRequiredDate = dateAckRequiredDate;
          user.respRequiredDate = dateRespRequiredDate;
          this.apiService
            .put(ApiURL.transmittal_recipients + '/' + user.id, user)
            .subscribe(
              (res) => {
                this.showMessageAndClose();
              },
              (err) => {
                this.utilitiesService.notifyError(
                  'Could not perform operation'
                );
              }
            );
        } else {
          transmittalRecipients.push({
            tRecName: user.name,
            tRecEmail: user.email,
            recComp: null,
            recTitle: null,
            isAckRequired: user.isAckRequired,
            isRespRequired: user.isRespRequired,
            acknolgment: null,
            response: null,
            ackDate: null,
            respDate: null,
            ackRequiredDate: user.ackRequiredDate,
            respRequiredDate: user.respRequiredDate,
            comments: null,
            transmittal: { id },
          });
        }
      });
      this.sendRequestSequentially(transmittalRecipients, 0);
      this.sendInboxRequest(transmittal);
    }
  }

  sendRequestSequentially(transmittalRecipients: any[], index: number) {
    if (index >= transmittalRecipients.length) {
      this.showMessageAndClose();
      return;
    }
    const recipient = transmittalRecipients[index];
    this.apiService.post(ApiURL.transmittal_recipients, recipient).subscribe(
      (res) => {
        this.sendRequestSequentially(transmittalRecipients, index + 1);
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation');
      }
    );
  }

  showMessageAndClose() {
    this.utilitiesService.notifySuccess('Transmittal Saved');
    this.ref.close(true);
  }

  async getNextSequenceNo(autono: string) {
    this.nextSequenceNo = 0;

    if (autono.length) {
      let query: ApiQuery = new ApiQuery();
      query = {
        contains: new Map<string, string>([['transmittalNo', autono]]),
      };

      query.size = 100000;
      this.apiService.get(ApiURL.transmittalcount, query).subscribe(
        (res) => {
          if (res) {
            this.nextSequenceNo += res + 1;
          } else {
            this.nextSequenceNo = 1;
          }
        },
        (err) => {
          this.utilitiesService.notifyError(err.error.title);
        }
      );
    }
  }

  async sendInboxRequest(transmittal) {
    if (transmittal.status === 'issue') {
      let data;
      if (this.recipients[0].userId) {
        this.recipients.forEach((user) => {
          data = {
            dateTime: new Date(),
            formId: transmittal.id,
            formType: 'transmittal',
            title: transmittal.projectName,
            message: transmittal.comments,
            unread: true,
            readTime: null,
            description: 'Transmittal Request',
            assignedToId: user.userId,
            assignedToName: user.name,
            assignedById: this.currentUser.userId,
            assignedByName: this.currentUser.name,
          };
          this.apiService.post(ApiURL.inboxes, data).subscribe(
            (res) => {},
            (err) => {
              this.utilitiesService.notifyError(err.error.title);
              throw new Error(
                'Error occurred while sending transmittal to inbox'
              );
            }
          );
        });
        this.utilitiesService.notifySuccess('Transmittal Sent to Inbox');
      }
    } else {
      return;
    }
  }

  closeForm() {
    this.ref.close();
  }

  async onClickEmailAction(transmittal, recipients) {
    let emails = [];
    let user: AppUsers = await this.utilitiesService.getCurrentAppUser();
    for (let i = 0; i < recipients.length; i++) {
      emails.push(recipients[i].email);
    }
    const emailsString = emails.join(',');
    let obj = {
      transmittalId: transmittal.id,
      transmittalNo: transmittal.transmittalNo,
      email: user.email,
      toEmail: emailsString,
      projectName: transmittal.projectName,
      subject: transmittal.subject,
      comments: transmittal.comments,
    };
    this.apiService.post('transmittals/transmital-email', obj).subscribe(
      (res) => {
        this.utilitiesService.notifySuccess('Email Sent Successfully');
      },
      (err) => {
        this.utilitiesService.notifyError('Something Wrong Happened.');
      }
    );
  }
}
