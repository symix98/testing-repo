import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AppUsers } from 'src/app/core/models/app-users.model';

@Component({
  selector: 'app-inbox-transmittal',
  templateUrl: './inbox-transmittal.component.html',
  styleUrls: ['./inbox-transmittal.component.scss'],
})
export class InboxTransmittalComponent implements OnInit {
  transmittal: any;
  transmittalRecipient: any;
  currentUser: AppUsers;
  isAckRequired: boolean = false;
  isRespRequired: boolean = false;
  acknowledgeCheckboxValue: boolean = false;
  transmittalDocuments: any;

  purposes: any[] = [
    { id: 'review', name: 'For Review' },
    { id: 'approval', name: 'For Approval' },
    { id: 'info', name: 'For Information' },
    { id: 'contr', name: 'For Construction' },
    { id: 'design', name: 'For Design' },
    { id: 'est', name: 'For Estimation' },
  ];

  types: any[] = [
    { id: 'transmittal', name: 'Transmittal' },
    { id: 'rfi', name: 'RFI' },
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        let obj = {
          id: params['id'],
        };
        this.getTransmittalById(obj.id);
      }
    });
  }

  getRecipientById(transmittalId, email) {
    this.apiService
      .get(
        ApiURL.transmittal_recipients +
          `?transmittalId.equals=${transmittalId}&tRecEmail.equals=${email}`
      )
      .subscribe(
        (res) => {
          this.transmittalRecipient = res[0];
          if (this.transmittalRecipient.isAckRequired) {
            this.isAckRequired = true;
          }

          if (this.transmittalRecipient.isRespRequired) {
            this.isRespRequired = true;
          }
          this.getTransmittalDocuments();
        },
        (error) => {}
      );
  }

  getTransmittalDocuments() {
    const url = `${ApiURL.documentss}?transmittalId.equals=${this.transmittal.id}`;
    this.apiService.get(url).subscribe(
      (res) => {
        this.transmittalDocuments = res;
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation');
      }
    );
  }

  getTransmittalById(id) {
    this.apiService.get(ApiURL.transmittals + '/' + id).subscribe(
      (res) => {
        this.transmittal = res;
        this.getRecipientById(this.transmittal.id, this.currentUser.email);
      },
      (error) => {}
    );
  }

  setAcknowledgeCheckboxValue() {
    this.acknowledgeCheckboxValue = true;
  }

  save() {
    if (this.acknowledgeCheckboxValue) {
      this.transmittalRecipient.acknolgment = true;
      this.transmittalRecipient.ackDate = new Date();
      this.transmittalRecipient.respDate = new Date();
    }
    if (this.transmittalRecipient.comments) {
      this.transmittalRecipient.response = true;
      this.transmittalRecipient.respDate = new Date();
    }
    this.apiService
      .patch(
        ApiURL.transmittal_recipients + '/' + this.transmittalRecipient.id,
        this.transmittalRecipient
      )
      .subscribe(
        (res) => {
          this.transmittal = res;
          this.utilitiesService.notifySuccess('Recipient Updated');
        },
        (error) => {
          this.utilitiesService.notifyError('Something went wrong');
        }
      );
  }
}
