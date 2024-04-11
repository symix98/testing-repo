import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-create-hyperlink-dialog',
  templateUrl: './create-hyperlink-dialog.component.html',
  styleUrls: ['./create-hyperlink-dialog.component.scss']
})
export class CreateHyperlinkDialogComponent implements OnInit {

  selectedUsers: any[];
  filteredUsers: any[];
  stateOptions: any[] = [
    { label: 'Private', value: 'Private' },
    { label: 'Public', value: 'Public' },
  ];


  constructor(
    private fb: FormBuilder,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private dateSarvice: DateService,
    private utilitiesService: UtilitiesService,
    private apiService: ApiService) { }
  
    isCopyLink:boolean = false
    linkUrl:string
  docList: any[] = [];
  form: FormGroup;
  formData: any
  async ngOnInit(): Promise<void> {
    let user:AppUsers = await this.utilitiesService.getCurrentAppUser()
    if (this.dynamicDialogConfig.data) {
      if (Array.isArray(this.dynamicDialogConfig.data)) {
        this.docList = this.dynamicDialogConfig.data;
      } else {
        this.docList.push(this.dynamicDialogConfig.data);
      }
    }
    this.form = this.fb.group({
      linkId: [this.generateToken(22)],
      message: [''],
      canView: [false],
      canEdit: [false],
      canDownload: [false],
      createdBy: [user.name],
      isPublic: ['Private'],
      creationDate: [this.dateSarvice.systemDateFormat(new Date())],
      expiryDate: ['']
    });
    this.formData = this.form.value;
    this.form.valueChanges.subscribe(data => {
      this.formData = data;
    });
  }

  onSubmit() {
    let obj = { ... this.formData }
    obj.documents = this.docList


    this.apiService.post(ApiURL.hyberlinks, obj).subscribe(res => {
      this.utilitiesService.notifySuccess("Link Created Successfully");
    })
  }

  generateToken(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }

    return token;
  }
  filterUsers(e) {

    let query: ApiQuery = new ApiQuery()
    query.contains = new Map<any, any>([['name', e.query]])
    this.apiService.get(ApiURL.appusers, query).subscribe((res: any) => {

      this.filteredUsers = res
    })
    console.log(e)
  }

  onCopyLink(){
    let obj = { ... this.formData }
    obj.documents = this.docList
    this.apiService.post(ApiURL.hyberlinks, obj).subscribe(res => {
      this.utilitiesService.notifySuccess("Link Created Successfully");
      this.isCopyLink = true
      this.linkUrl = "http://localhost:4200/#/viewDocs;id=" + res.linkId
    })
  }
  copyClipBoard(){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.linkUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.utilitiesService.notifySuccess("Link Copied to Clipboard");
  }


}
