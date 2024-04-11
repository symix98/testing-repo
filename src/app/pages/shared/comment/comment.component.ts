import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FormType } from 'src/app/core/miscellaneous/global-props.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  header: any;
  msg: string;
  label: string;
  res: any;

  roleIds: any[] = [];
  properties: any;
  isDisabled: boolean =  true;
  isRoleIdVisible: boolean = false;

  prevStep: any;
  nextStep: any;
  finalStep: any;
  prevRole: any;
  nextRole: any;
  status: any;
  finalRole: any;
  tempData: any;
  finalStatus: any;

  selectedUsers: any[];
  filteredUsers: any[];
  toUserEmail: any[] = [];
  // toUserEmail: { userId: string, email: string }[] = [];

  constructor(private apiService : ApiService, private utilitiesService: UtilitiesService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  async ngOnInit(): Promise<void> {
    let user = await this.utilitiesService.getCurrentAppUser();
    
    if (this.config.data.properties.workflow) {
      let query: ApiQuery = new ApiQuery();
      this.header = this.config.data;
      this.label = this.config.data.label;
      this.properties = this.config.data.properties;
      query = { filter: new Map<string, string>([['formType', this.properties.workflow]]) };
      query.sort = ['sequence,asc'];
      this.apiService.get(ApiURL.workflow_templates, query).subscribe((result) => {
        if(result) {
          this.tempData = result;
          for (let i = 0; i < result.length; i++) {
            if (this.properties.currentStep == result[i].stepName) {
              if(i == 0) {
                this.prevStep = result[i].stepName;
                this.prevRole = result[i].roles;
                this.nextStep = result[i+1].stepName;
                this.nextRole = result[i+2].roles;
                this.status = result[i+1].successStatus
                this.finalStep = result[result.length - 1].stepName;
                this.finalRole = result[result.length - 1].roles;
                this.finalStatus = result[result.length - 1].successStatus;
              } else if (i >= 1) {
                this.prevStep = result[i-1].stepName;
                this.prevRole = result[i-1].roles;
                this.nextStep = result[i+1].stepName;
                this.nextRole = result[i+1].roles;
                this.finalStep = result[result.length - 1].stepName;
                this.finalRole = result[result.length - 1].roles;
                this.finalStatus = result[result.length - 1].successStatus;
              }
            }
          }
        }
        let inboxQuery: ApiQuery = new ApiQuery();
        inboxQuery.sort = ['id,asc'];
        this.apiService.get(ApiURL.inboxes + '?formId.equals=' + this.header.id + '&title.equals=' + this.properties.currentStep, inboxQuery).subscribe((res) => {
          for (let i = 0; i < res.length; i++) {
            this.roleIds.push(res[i].assignedToId);
          }
          for (let i = 0; i < this.roleIds.length; i++) {
            if (user.userId == this.roleIds[i]) {
              this.isRoleIdVisible = true;
            }
          }
        })
      })
    } else {}
  }

  filterUsers(e) {
    let query: ApiQuery = new ApiQuery()
    query.contains = new Map<any, any>([['name', e.query]])
    this.apiService.get(ApiURL.appusers, query).subscribe((res: any) => {
      this.filteredUsers = res
    })
  }

  edited(e) {
    this.isDisabled = false;
  }

  onRevise() {
    this.onGetReviseUserby(this.selectedUsers)
  }

  onGetReviseUserby(users) {
    for(let i=0; i< users.length; i++) {
      this.toUserEmail.push(users[i].email)
    }
    this.onPreviousStatus(this.toUserEmail)
  }
  
  async onPreviousStatus(toUsers) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = {
      formId: this.properties.id,
      formType: this.properties.workflow,
      email: user.email,
      toEmail: toUsers,
      comment: this.msg,
    }
    this.apiService.post(ApiURL.workflow_revise + '/' + data.email + '/' + data.toEmail + '/' + data.comment, data).subscribe(res => {
      if (res) {
        this.properties.currentStep = this.prevStep,
        this.properties.sstatus = this.properties.sstatus,
        this.apiService.patch(ApiURL.documentss + '/' + this.properties.id, this.properties).subscribe(res => {
          this.utilitiesService.notifySuccess("Document Revised")
          this.ref.close(res);
        })
      }
    }, (err) => {
      this.utilitiesService.notifyError("Something Wrong Happend!")
      this.ref.close(true);
    })
  }

  onApprove() {
    this.onGetApproveUserby(this.selectedUsers)
  }

  onGetApproveUserby(users) {
    for(let i=0; i< users.length; i++) {
      this.toUserEmail.push(users[i].email)
      // this.toUserEmail.push({ userId: users[i].userId, email: users[i].email });
    }
    this.onNextStatus(this.toUserEmail)
  }

  async onNextStatus(toUsers) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = {
      formId: this.properties.id,
      formType: this.properties.workflow,
      email: user.email,
      toEmail: toUsers,
      comment: this.msg,
    }
    this.apiService.post(ApiURL.workflow_approve + '/' + user.email + '/' + data.toEmail + '/' + data.comment, data).subscribe(res => {
      if (res) {
        this.properties.currentStep = this.nextStep,
        this.properties.sstatus = this.status
        this.apiService.patch(ApiURL.documentss + '/' + this.properties.id, this.properties).subscribe(res => {
          this.utilitiesService.notifySuccess("Document Approved");
          this.ref.close(res);
        })
      }
    }, (err) => {
      this.utilitiesService.notifyError("Something Wrong Happend!");
      this.ref.close(true);
    })
  }

  onFinal() {
    this.onGetInitiateUserby(this.selectedUsers)
  }

  onGetInitiateUserby(users) {
    for(let i=0; i< users.length; i++) {
      this.toUserEmail.push(users[i].email)
    }
    this.onSetFinalStatus(this.toUserEmail)
  }

  async onSetFinalStatus(toUsers) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = {
      formId: this.properties.id,
      formType: this.properties.workflow,
      email: user.email,
      toEmail: toUsers,
      comment: this.msg,
    }
    this.apiService.post(ApiURL.workflow_final + '/' + data.email + '/' + data.toEmail + '/' + data.comment, data).subscribe(res => {
      if (res) {
        this.properties.currentStep = this.finalStep,
        this.properties.sstatus = this.finalStatus
        this.apiService.patch(ApiURL.documentss + '/' + this.properties.id, this.properties).subscribe(res => {
          this.utilitiesService.notifySuccess("Document Completed");
          this.ref.close(res);
        })
      }
    }, (err) => {
      this.utilitiesService.notifyError("Something Wrong Happend!");
      this.ref.close(true);
    })
  }

}
