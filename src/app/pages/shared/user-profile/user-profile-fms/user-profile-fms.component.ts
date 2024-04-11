import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Account } from 'src/app/core/models/account.model';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { MainComponent } from 'src/app/pages/main/main.component';
import { ProjectInfo } from 'src/app/core/models/project-info.model';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AttachmentType, Attachments } from 'src/app/core/models/attachments.model';


@Component({
  selector: 'app-user-profile-fms',
  templateUrl: './user-profile-fms.component.html',
  styleUrls: ['./user-profile-fms.component.scss']
})

export class UserProfileFmsComponent implements OnInit {

  userid: any;
  role: String;
  name: String;
  email: String;
  username: String;
  appUsers: AppUsers[];
  isAdministrator: boolean;
  displayProfile: boolean = false;

  // Get and Upload Profile Picture
  attachment: any;
  projectInfoId: any;
  inputForm: FormGroup;
  profileAttachment: any;
  profileLogoExists: boolean;
  logos: any[] = [null, null];
  files: File[] = [null, null];
  loggedInUserAccount: Account;
  projectInfo: ProjectInfo = new ProjectInfo();
  profileLogo: String = 'assets/images/user.svg';

  // Get and Upload Signature
  user: any;
  fileType: any;
  filename: any;
  loading: boolean;
  attachmentS: any;
  attachmentId: any;
  signatureImg: any;
  signatureUpload: any;
  showSignaturePad: boolean;
  attachmentExists: boolean;
  signatureImgToUpload: any;
  showSignature: boolean = false;
  editUserSignature: boolean = false;
  subscriptions = new Subscription();
  showSignatureBrowseSection: boolean;

  constructor(
    private router: Router, private apiService: ApiService, private fb: FormBuilder,
    public app: MainComponent, private utilities: UtilitiesService, private ref: DynamicDialogRef,
    private keycloakService: KeycloakService, public device: DeviceDetectorService, private confirmationService: ConfirmationService
  ) { 
    this.getAppUsers();
    this.getProjectInfo();
    this.initForm();
  }

  async ngOnInit(): Promise<void> {
    this.username = this.keycloakService.getUsername();
    let e = await this.utilities.getCurrentAppUser()
    this.isAdministrator = e.isAdministrator;
    this.userid = e.userId;
    this.name = e.name;
    this.email = e.email;
    this.role = e.roles[0] ? e.roles[0].description : null;
    this.loading = true;
    this.loggedInUserAccount = this.utilities.getLoggedinAccount();
    this.getUserInfo();
  }

  initForm() {
    this.inputForm = this.fb.group({
      profileFileInput: [],
    });
  }

  getAppUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get(ApiURL.appusers).subscribe((res) => {
        this.appUsers = res;
        this.appUsers.forEach((e) => {
          if (e.email == this.utilities.getLoggedinAccount().email) {
            this.userid = e.userId;
            this.name = e.name;
            this.email = e.email;
            this.role = e.roles[0] ? e.roles[0].description : null;
          }
        });
        resolve();
      });
    });
  }

  logout() {
    this.keycloakService.logout();
  }

  openUserProfile() {
    this.router.navigate(['profile']);
  }

  removeFile() {
    this.logos[0] = null;
  }

  refreshPage() {
    this.getProjectInfo();
  }

  getProjectInfo() {
    this.loading = true;
    this.logos = [null, null];
    this.files = [null, null];

    this.apiService.get(ApiURL.appusers).subscribe((res) => {
      this.appUsers = res;
      this.appUsers.forEach((e) => {
        if (e.email == this.utilities.getLoggedinAccount().email) {
          this.userid = e.userId;
          this.name = e.name;
          this.email = e.email;
          this.role = e.roles[0] ? e.roles[0].description : null;
        }
      });
      this.subscriptions.add(
        this.apiService.get(ApiURL.attachements + '?description.equals=' + this.userid + 'Profile').subscribe((res) => {
            this.attachment = res;
            this.attachmentId = this.attachment[0]?.id;
            if (this.attachment.length > 0) {
              this.profileAttachment = this.attachment[0];
              this.profileLogo = 'data:image/png;base64,' + this.attachment[0].data;
            }
            if (this.attachment) {
              this.getAttachments();
            }
          })
      );
    });
  }

  getAttachments() {
    this.subscriptions.add(
      this.apiService.get(ApiURL.attachements + '?description.equals=' + this.userid + 'Profile').subscribe((res) => {
        if (res.length > 0) {
          const profileAttachment = res[0];
          this.profileLogoExists = profileAttachment ? true : false;
          if (this.profileLogoExists)
            this.profileLogo = 'data:image/png;base64,' + profileAttachment.data;
        }
        this.loading = false;
      })
    );
  }

  getUserInfo() {
    let query: ApiQuery = null;
    query = {
      filter: new Map<string, string>([['email', this.loggedInUserAccount.email],]),
    };

    this.subscriptions.add(
      this.apiService.get(ApiURL.appusers, query).subscribe(
        (data) => {
          const [user] = data;
          this.attachmentExists = user.attachmentId ? true : false;
          this.attachmentId = user.attachmentId;
          this.attachmentS = user.attachement;
          this.user = { ...user, role: user?.roles[0]?.description };
          this.getSupervisorName(user.siteEngineer);
        }, () => {
          this.loading = false;
          this.utilities.notifyError('Error Retrieving User Information');
        }
      )
    );
  }

  getSupervisorName(supervisorId) {
    let query: ApiQuery = null;
    query = {
      filter: new Map<string, string>([['email', supervisorId]]),
    };

    this.subscriptions.add(
      this.apiService.get(ApiURL.appusers, query).subscribe(
        (data) => {
          const [user] = data;
          this.user['siteEngineerName'] = user?.name;
          this.loading = false;
        }, () => {
          this.loading = false;
          this.utilities.notifyError('Error Retrieving Supervisor Name');
        }
      )
    );
  }

  async processImages() {
    if (this.logos[0]) {
      const profileLogo = this.logos[0].blob;
      await this.processImage(profileLogo);
    }
  }

  async processImage(signature: any) {
    const signatureSplitted = signature.split(',');
    let attachmentLogo = new Attachments();
    attachmentLogo.description = this.userid + 'Profile';
    attachmentLogo.type = AttachmentType.Image;
    attachmentLogo.data = signatureSplitted[0];
    attachmentLogo.dataContentType = this.files[0].type || 'image/png';
    attachmentLogo.fileName = this.files[0].name;
    if (this.profileAttachment) {
      attachmentLogo.id = this.profileAttachment.id;
      await this.updateProfileAttachment(attachmentLogo, attachmentLogo.id);
    } else {
      await this.createProfileAttachment(attachmentLogo);
    }
  }

  createProfileAttachment(attachment): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscriptions.add(
        this.apiService.post(ApiURL.attachements, attachment).subscribe((data) => {
          resolve();
          this.utilities.notifySuccess('Image successfully saved');
          this.refreshPage();
        }, () => {
          this.utilities.notifyError('Error saving signature');
        })
      );
    });
  }

  updateProfileAttachment(attachment, id): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${ApiURL.attachements}/${id}`;
      this.subscriptions.add(
        this.apiService.put(url, attachment).subscribe((data) => {
          resolve();
          this.utilities.notifySuccess('Image successfully updated');
          this.refreshPage();
        }, () => {
          this.utilities.notifyError('Error saving Image');
        })
      );
    });
  }

  async save() {
    const confirm = await this.utilities.confirmDialog('Are you sure you want to save your changes?');
    if (confirm) {
      const url = ApiURL.attachements + '/' + this.attachmentId;
      await this.processImages();
      if (!this.attachment) {
        this.attachment = [{ ...this.profileAttachment }];
      }
      this.apiService.get(url, this.attachment).subscribe((res) => {
          this.utilities.notifySuccess('Project Info updated successfully.');
          this.refreshPage();
        }, () => {
          this.utilities.notifyError('Error updating Project Info ');
        }
      );
    }
  }

  addFile(event, attachmentType) {
    const fileReader = new FileReader();
    let index = 0;
    if (event.target.files) {
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = (e) => {
        let image: any = {};
        const resultStr: string = e.target.result.toString();
        const base64Data = resultStr.substr(resultStr.indexOf('base64,') + 'base64,'.length);
        image.type = event.target.files[0].type;
        image.blob = base64Data;
        this.logos[index] = image;
        this.files[index] = event.target.files[0];
        this.inputForm.get('profileFileInput').setValue(null);
      };
    }
  }

  chooseSignatureUpload() {
    if (this.signatureUpload === 'pad') {
      if (this.showSignaturePad) {
        this.showSignaturePad = false;
      } else this.showSignaturePad = true;
      this.showSignatureBrowseSection = false;
    } else if (this.signatureUpload === 'upload') {
      this.showSignaturePad = false;
      if (this.showSignatureBrowseSection) {
        this.showSignatureBrowseSection = false;
      } else this.showSignatureBrowseSection = true;
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
    };
  }

  onRemoveSignImg() {
    this.signatureImgToUpload = null;
  }

  saveSignatureImage() {
    this.confirmationService.confirm({ message: 'Are you sure you want to save signature?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.processSignature(this.signatureImgToUpload);
      },
      reject: () => {},
      key: 'saveUploadedSignature',
    });
  }

  processRetrievedSignature() {
    this.signatureImg = 'data:image/png;base64,' + this.attachmentS.data;
    if (this.showSignature) {
      this.showSignature = false;
    } else this.showSignature = true;
    this.editUserSignature = false;
    this.showSignaturePad = false;
    this.showSignatureBrowseSection = false;
  }

  editSignature() {
    if (this.editUserSignature) {
      this.editUserSignature = false;
    } else this.editUserSignature = true;
    this.showSignaturePad = false;
    this.showSignatureBrowseSection = false;
  }

  processSignature(signature: any) {
    const signatureSplitted = signature.split(',');
    let attachment = new Attachments();
    attachment.description = 'Employee Signature';
    attachment.type = AttachmentType.UserSignature;
    attachment.data = signatureSplitted[1];
    attachment.dataContentType = this.fileType || 'image/png';
    attachment.fileName = this.filename || `signature_${this.loggedInUserAccount.email}_${new Date().toISOString()}`;
    attachment.id = this.attachmentId;
    if (this.attachmentId) {
      this.updateAttachment(attachment);
    } else {
      this.createAttachment(attachment);
    }
  }

  updateAttachment(attachment) {
    const url = `${ApiURL.attachements}/${this.attachmentId}`;
    this.subscriptions.add(
      this.apiService.put(url, attachment).subscribe((data) => {
          this.ref.close();
          this.utilities.notifySuccess('Signature Successfully Updated');
        }, () => {
          this.utilities.notifyError('Error Saving Signature');
        }
      )
    );
  }

  createAttachment(attachment) {
    this.subscriptions.add(
      this.apiService.post(ApiURL.attachements, attachment).subscribe((data) => {
          this.ref.close();
          this.utilities.notifySuccess('Signature Successfully Saved');
        }, () => {
          this.utilities.notifyError('Error Saving Signature');
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
