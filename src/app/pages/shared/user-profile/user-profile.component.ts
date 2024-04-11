import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Account } from 'src/app/core/models/account.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Subscription } from 'rxjs';
import { Attachments, AttachmentType } from 'src/app/core/models/attachments.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  loading: boolean;
  loggedInUserAccount: Account;
  user: any;
  showSignaturePad: boolean;
  attachmentExists: boolean;
  attachment: any;

  showSignature: boolean;
  signatureImg: any;
  attachmentId: any;

  signatureUpload: any;
  showSignatureBrowseSection: boolean;
  signatureImgToUpload: any;
  filename: any;
  fileType: any;

  editUserSignature: boolean;

  subscriptions = new Subscription();

  constructor(private utilities: UtilitiesService,
    private apiService: ApiService,
    private ref: DynamicDialogRef,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loading = true;
    this.loggedInUserAccount = this.utilities.getLoggedinAccount();
    this.getUserInfo();
  }

  getUserInfo() {
    let query: ApiQuery = null;
    query = {
      filter: new Map<string, string>([['email', this.loggedInUserAccount.email]])
    };

    this.subscriptions.add(this.apiService.get(ApiURL.appusers, query).subscribe(data => {
      const [user] = data;
      this.attachmentExists = user.attachmentId ? true : false;
      this.attachmentId = user.attachmentId;
      this.attachment = user.attachement;
      this.user = { ...user, 'role': user?.roles[0]?.description };

      this.getSupervisorName(user.siteEngineer);
    }, () => {
      this.loading = false;
      this.utilities.notifyError('Error retrieving user information');
    }));
  }

  getSupervisorName(supervisorId) {
    let query: ApiQuery = null;
    query = {
      filter: new Map<string, string>([['email', supervisorId]])
    };

    this.subscriptions.add(this.apiService.get(ApiURL.appusers, query).subscribe(data => {
      const [user] = data;
      this.user['siteEngineerName'] = user?.name;
      this.loading = false;
    }, () => {
      this.loading = false;
      this.utilities.notifyError('Error retrieving supervisor name');
    }));
  }

  chooseSignatureUpload() {
    if (this.signatureUpload === 'pad') {
      this.showSignaturePad = true;
      this.showSignatureBrowseSection = false;
    }
    else if (this.signatureUpload === 'upload') {
      this.showSignaturePad = false;
      this.showSignatureBrowseSection = true;
    }
  }

  onSelectSignatureImg(event) {
    let file: File = event.files[0];
    const currentFiles = event.currentFiles[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      const imgStr: string = e.target.result.toString();
      this.signatureImgToUpload = imgStr;
      const { type, name } = currentFiles;
      this.fileType = type;
      this.filename = name;
    }
  }

  saveSignatureImage() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to save signature?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.processSignature(this.signatureImgToUpload);
      },
      reject: () => {

      },
      key: "saveUploadedSignature"
    });
    // this.processSignature(this.signatureImgToUpload);
  }

  processRetrievedSignature() {
    this.signatureImg = 'data:image/png;base64,' + this.attachment.data;
    this.showSignature = true;
  }

  editSignature() {
    this.editUserSignature = true;
  }

  onRemoveSignImg() {
    this.signatureImgToUpload = null;
  }

  processSignature(signature: any) {
    const signatureSplitted = signature.split(',');

    let attachment = new Attachments();
    attachment.description = 'Employee Signature';
    attachment.type = AttachmentType.UserSignature;
    attachment.data = signatureSplitted[1];
    attachment.dataContentType = this.fileType || "image/png";
    attachment.fileName = this.filename || `signature_${this.loggedInUserAccount.email}_${new Date().toISOString()}`;
    attachment.id = this.attachmentId;

    if (this.attachmentId) {
      this.updateAttachment(attachment);
    } else {
      this.createAttachment(attachment);
    }
  }

  createAttachment(attachment) {
    this.subscriptions.add(this.apiService.post(ApiURL.attachements, attachment).subscribe(data => {
      this.ref.close();
      this.utilities.notifySuccess('Signature successfully saved');
    }, () => {
      this.utilities.notifyError('Error saving signature');
    }));
  }

  updateAttachment(attachment) {
    const url = `${ApiURL.attachements}/${this.attachmentId}`;
    this.subscriptions.add(this.apiService.put(url, attachment).subscribe(data => {
      this.ref.close();
      this.utilities.notifySuccess('Signature successfully updated');
    }, () => {
      this.utilities.notifyError('Error saving signature');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}