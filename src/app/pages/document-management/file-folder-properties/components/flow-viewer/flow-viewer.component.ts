import { Component, Input, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-flow-viewer',
  templateUrl: './flow-viewer.component.html',
  styleUrls: ['./flow-viewer.component.scss']
})

export class FlowViewerComponent implements OnInit {

  @Input() data: any;
  cols: any[];
  tableData: any[];
  getWorkFlows: any[];
  getFormTypes: [] = [];
  selectedWorkFlow: any;
  getUniqueformTypes: any;
  selectedWorkFlowType: any;
  nextUserRole: any;
  status: any;
  csName: any;
  workFlowSteps: any[];
  selectedUsers: any[];
  filteredUsers: any[];
  toUserEmail: any[] = [];
  isDisable: boolean = true;

  constructor(private apiService: ApiService, private dialogRef: DynamicDialogRef, private utilitiesService: UtilitiesService,) { }

  ngOnInit(): void {
    if (this.data.workflow) {
      this.selectedWorkFlowType = this.data.workflow;
      this.csName = this.data.currentStep;
      let query: ApiQuery = new ApiQuery();
      query = { filter: new Map<string, string>([['formType', this.data.workflow]]) };
      query.sort = ['sequence,asc'];
      this.apiService.get(ApiURL.workflow_templates, query).subscribe(result => {
        for (let i = 0; i < result.length; i++) {
          this.workFlowSteps = result.map(item => item.stepName);
        }
      });
    } else {
      this.getListOfWorkFlows();
      this.cols = [
        { field: 'stepName', header: 'Step Name' },
        { field: 'actionDescription', header: 'Description' },
      ]
    }
  }

  getListOfWorkFlows() {
    this.apiService.get(ApiURL.workflow_templates).subscribe((res: any[]) => {
      const formTypesSet = new Set<string>();
      this.getWorkFlows = res;
      this.getWorkFlows.forEach(item => {
        if(item.formType) {
          formTypesSet.add(item.formType);
        }
      });
      this.getUniqueformTypes = Array.from(formTypesSet);
      this.getFormTypes = this.getUniqueformTypes.map(formType => ({
        name: formType,
        code: formType,
      }));
    })
  }

  onWorkFlowSelected(event) {
    let query: ApiQuery = new ApiQuery();
    query = { filter: new Map<string, string>([['formType', event.value.name]]) };
    query.sort = ['sequence,asc'];
    this.apiService.get(ApiURL.workflow_templates, query).subscribe(result => {
      this.tableData = result;
    });
    this.selectedWorkFlowType = event.value.name;
  }

  filterUsers(e) {
    let query: ApiQuery = new ApiQuery()
    query.contains = new Map<any, any>([['name', e.query]])
    this.apiService.get(ApiURL.appusers, query).subscribe((res: any) => {
      this.filteredUsers = res
    })
    this.isDisable = false;
  }

  async applyWorkFlow() {
    let user = await this.utilitiesService.getCurrentAppUser();
    if(this.tableData[0].roles == user.roles[0].roleId) {
      this.nextUserRole = this.tableData[1].roles;
    }
    this.csName = this.tableData[0].stepName;
    this.status = this.tableData[0].successStatus;
    this.onSaveDocument(this.data, this.selectedUsers);
  }

  onSaveDocument(documentData, nextUserRole) {
    for(let i=0; i< nextUserRole.length; i++) {
      this.toUserEmail.push(nextUserRole[i].email)
    }
    this.saveRequest(documentData, this.toUserEmail);
  }

  async creatWorkflowProcess(detail, toUser) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = {
      formId: detail.id,
      description: detail.documentsNumber,
      initiationTime: new Date(),
      formType: this.selectedWorkFlowType,
      initiatedByUserId: user.userId,
    };
    this.apiService.post(ApiURL.formflow_steps + '/' + detail.id + '/' + toUser, data).subscribe((res) => { });
  }

  saveRequest(documentData, user) {
    documentData.workflow = this.selectedWorkFlowType,
      documentData.currentStep = this.csName,
      documentData.sstatus = this.status
    if (documentData.id) {
      this.apiService.patch(ApiURL.documentss + '/' + documentData.id, documentData).subscribe(result => {
        this.creatWorkflowProcess(result, user);
        this.utilitiesService.notifySuccess('Work Flow Applied Successfully!');
        this.dialogRef.close(result);
      }, (err) => {
        this.utilitiesService.notifyError('Something Wrong Happened.');
      })
    } else {
      this.utilitiesService.notifyError('Something Wrong Happened.');
    }
  }

}
