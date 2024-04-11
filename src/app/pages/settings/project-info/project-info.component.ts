import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Attachments, AttachmentType } from 'src/app/core/models/attachments.model';
import { ProjectInfo } from 'src/app/core/models/project-info.model';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {

  @ViewChild('projectInfoForm') projectInfoForm: NgForm;

  subscriptions: Subscription = new Subscription();
  projectInfo: ProjectInfo = new ProjectInfo();
  editing: boolean = false;
  projectInfoId: any
  attachment: any;
  companyAttachment: any;
  clientAttachment: any;
  files: File[] = [null, null];
  logos: any[] = [null, null];
  companyLogo: any;
  clientLogo: any;
  companyLogoExists: boolean;
  clientLogoExists: boolean;

  loading: boolean = false;

  inputForm: FormGroup;

  constructor(
    private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private router: Router,
    private dateUtilities: DateService,
    private fb: FormBuilder) {
    this.getProjectInfo();
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.inputForm = this.fb.group({
      companyFileInput: [],
      clientFileInput: []
    });
  }
  getProjectInfo() {
    this.loading = true;

    this.logos = [null, null];
    this.files = [null, null];

    this.subscriptions.add(this.apiService.get(ApiURL.project_info).subscribe(res => {
      this.projectInfo = res[0];
      this.projectInfoId = this.projectInfo?.id;
      this.attachment = this.projectInfo?.attachements;

      if (this.attachment.length > 0) {
        this.companyAttachment = this.attachment.find(attachment => attachment.type === AttachmentType.CompanyLogo);
        this.clientAttachment = this.attachment.find(attachment => attachment.type === AttachmentType.ClientLogo);
      }
      if (this.projectInfoId) {
        this.getAttachments()
      }

    }));
  }

  getAttachments() {
    let query: ApiQuery = null;
    query = {
      filter: new Map<any, any>([['projectInfoId', this.projectInfoId]])
    };

    this.subscriptions.add(this.apiService.get(ApiURL.attachements, query).subscribe(res => {
      if (res.length > 0) {
        const companyAttachment = res.find(attachment => attachment.type == AttachmentType.CompanyLogo);
        this.companyLogoExists = companyAttachment ? true : false;
        if (this.companyLogoExists)
          this.companyLogo = 'data:image/png;base64,' + companyAttachment.data;
        const clientAttachment = res.find(attachment => attachment.type == AttachmentType.ClientLogo);
        this.clientLogoExists = clientAttachment ? true : false;
        if (this.clientLogoExists)
          this.clientLogo = 'data:image/png;base64,' + clientAttachment.data;
      }
      this.loading = false;
    }));
  }

  async processSignature(signature: any, company: boolean) {
    const index = company ? 0 : 1;
    const signatureSplitted = signature.split(',');
    let attachmentLogo = new Attachments();
    attachmentLogo.description = company ? 'Company Logo' : 'Client Logo';
    attachmentLogo.type = company ? AttachmentType.CompanyLogo : AttachmentType.ClientLogo;
    attachmentLogo.data = signatureSplitted[0];
    attachmentLogo.dataContentType = this.files[index].type || "image/png";
    attachmentLogo.fileName = this.files[index].name;
    attachmentLogo.projectInfoId = this.projectInfoId;

    if (company) {
      if (this.companyAttachment) {
        attachmentLogo.id = this.companyAttachment.id;
        attachmentLogo.projectInfo = this.companyAttachment.projectInfo;
        await this.updateAttachment(attachmentLogo, attachmentLogo.id);
      }
      else {
        attachmentLogo.projectInfo = this.projectInfo;
        await this.createAttachment(attachmentLogo);
      }

    }

    if (!company) {
      if (this.clientAttachment) {
        attachmentLogo.id = this.clientAttachment.id;
        attachmentLogo.projectInfo = this.clientAttachment.projectInfo;
        await this.updateAttachment(attachmentLogo, attachmentLogo.id);
      }
      else {
        attachmentLogo.projectInfo = this.projectInfo;
        await this.createAttachment(attachmentLogo);
      }
    }
  }

  async processSignatures() {
    if (this.logos[0]) {
      const companyLogo = this.logos[0].blob;
      await this.processSignature(companyLogo, true);
    }
    if (this.logos[1]) {
      const clientLogo = this.logos[1].blob;
      await this.processSignature(clientLogo, false);
    }
  }

  createAttachment(attachment): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscriptions.add(this.apiService.post(ApiURL.attachements, attachment).subscribe(data => {
        resolve();
        //this.utilitiesService.notifySuccess('Signature successfully saved');
      }, () => {
        this.utilitiesService.notifyError('Error saving signature');
      }));
    });
  }

  updateAttachment(attachment, id): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${ApiURL.attachements}/${id}`;
      this.subscriptions.add(this.apiService.put(url, attachment).subscribe(data => {
        resolve();
        // this.utilitiesService.notifySuccess('Signature successfully updated');
      }, () => {
        this.utilitiesService.notifyError('Error saving signature');
      }));
    });
  }

  async save() {
    const confirm = await this.utilitiesService.confirmDialog("Are you sure you want to save your changes?");
    if (confirm) {
      const url = ApiURL.project_info + '/' + this.projectInfoId;
      await this.processSignatures();

      if (!this.projectInfo.attachements) {
        this.projectInfo.attachements = [{ ...this.companyAttachment, ...this.clientAttachment }];
      }
      this.projectInfo.startDate = this.dateUtilities.systemDateFormat(this.projectInfo.startDate);
      this.projectInfo.endDate = this.dateUtilities.systemDateFormat(this.projectInfo.endDate);

      this.subscriptions.add(this.apiService.put(url, this.projectInfo).subscribe((res) => {

        this.utilitiesService.notifySuccess("Project Info updated successfully.");
        this.refreshPage();
        this.editing = false;

      }, () => {
        this.utilitiesService.notifyError("Error updating Project Info ")
      }))
    }
  }

  addFile(event, attachmentType) {
    const fileReader = new FileReader();
    let index = 0;
    if (event.target.files) {
      attachmentType == 'Client' ? index = 1 : index = 0;
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = (e) => {
        let image: any = {};
        const resultStr: string = e.target.result.toString();
        const base64Data = resultStr.substr(resultStr.indexOf('base64,') + 'base64,'.length);
        image.type = event.target.files[0].type;
        image.blob = base64Data;
        this.logos[index] = image;
        this.files[index] = event.target.files[0];

        if (attachmentType == "Client") {
          this.inputForm.get('clientFileInput').setValue(null);
        }
        else {
          this.inputForm.get('companyFileInput').setValue(null);
        }
      }
    }
  }

  removeFile(attachmentType) {
    if (attachmentType == 'Company') {
      this.logos[0] = null;
      // this.files[0] = null;
    } else {
      this.logos[1] = null;
      //this.files[1] = null
    }
  }

  edit() {
    this.editing = !this.editing;
    if (!this.editing)
      this.projectInfoForm.form.disable();
    else {
      this.projectInfoForm.form.enable();
    }
  }

  refreshPage() {
    this.getProjectInfo();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}