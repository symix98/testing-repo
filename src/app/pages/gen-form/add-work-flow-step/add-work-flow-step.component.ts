import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from '../../../core/miscellaneous/api.template';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { WorkFlowService } from 'src/app/core/services/work-flow.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { WorkflowTemplate } from 'src/app/core/models/workflow-template.model';


@Component({
  selector: 'app-add-work-flow-step',
  templateUrl: './add-work-flow-step.component.html',
  styleUrls: ['./add-work-flow-step.component.scss']
})

export class AddWorkFlowStepComponent implements OnInit {

  constructor(
    private utilities: UtilitiesService, private activatedRouteService: ActivatedRoute,
    private dynamicDialogRef: DynamicDialogRef, private dynamicDialogConfig: DynamicDialogConfig,
    private router: Router, private apiService: ApiService, private workFlowService: WorkFlowService,
  ) { }

  type: any;
  step: any;
  cols: any[];
  rolesList: any[];
  templateId = '';
  actValues: any;
  mActValues: any;
  signOffValues: any;
  isLoading: boolean = false;
  isDisabled: boolean =  true;
  isInputDisabled: boolean = false;
  isFormFieldEnable: boolean = false;
  WorkflowTemplateData: WorkflowTemplate;


  ngOnInit(): void {
    let id = this.activatedRouteService.snapshot.paramMap.get('id');
    this.templateId = id;

    if (id != 'new') {
      this.type = this.dynamicDialogConfig.data.formType;
      this.step = this.dynamicDialogConfig.data.stpName ? this.dynamicDialogConfig.data.stpName : null;
      if (this.step == null) {
        this.apiService.get(ApiURL.workflow_templates + '?formType.in=' + this.type + '&sort=id,asc').subscribe(res => {
          this.WorkflowTemplateData = new WorkflowTemplate
          this.WorkflowTemplateData.sequence = res[res.length - 1].sequence + 1;
          this.WorkflowTemplateData.formType = this.type;
          this.isFormFieldEnable = true;
        })
      } else {
        this.apiService.get(ApiURL.workflow_templates + '?formType.in=' + this.type + '&stepName.in=' + this.step).subscribe((res: WorkflowTemplate) => {
          this.WorkflowTemplateData = res[0];
          this.isFormFieldEnable = true;
        })
      }
    } else {
      this.WorkflowTemplateData = new WorkflowTemplate
      this.WorkflowTemplateData.sequence = 1;
      this.isFormFieldEnable = false;
    }

    this.apiService.get(ApiURL.roles).subscribe(data => {
      this.rolesList = data.map(formType => ({
        label: formType.description,
        value: formType.roleId,
      }));
    })

    this.actValues = [{ label: 'True', value: true }, { label: 'False', value: false }];
    this.mActValues = [{ label: 'True', value: true }, { label: 'False', value: false }];
    this.signOffValues = [{label: 'All', value: 'All' }, {label: 'Any', value:'Any'}, {label: 'None', value: 'None'}];

  }

  back() {
    this.router.navigate(['gen-form']);
  }

  edited(e) {
    this.isDisabled = false;
  }

  onRoleChange(e) {
    this.isDisabled = false;
  }

  onActiveChange(event: any) {
    this.isDisabled = false;
  }

  onMultiActChange(event: any) {
    this.isDisabled = false;
  }

  onSignOffChange(event: any) {
    this.isDisabled = false;
  }

  saveWorkFlowStep() {
    if (this.templateId != 'new') {
      if (this.step == null) {
        this.workFlowService.AddWorkFlowStep(this.WorkflowTemplateData).subscribe(res => {
          if (res) {
            this.utilities.notifySuccess("Work Flow Step Added Successfully");
            this.isDisabled = true;
            this.dynamicDialogRef.close(res);
          }
        }, (err) => {
          this.utilities.notifyError("Something Wrong Happened.")
        })
      } else {
        this.workFlowService.EditWorkFlowTemplate(this.WorkflowTemplateData.id, this.WorkflowTemplateData).subscribe(res => {
          if (res) {
            this.utilities.notifySuccess("Work Flow Step Updated Successfully");
            this.isDisabled = true;
            this.dynamicDialogRef.close(res);
          }
        }, (err) => {
          this.utilities.notifyError("Something Wrong Happened.")
        })
      }
    } else {
      this.workFlowService.AddWorkFlowTemplate(this.WorkflowTemplateData).subscribe((res: WorkflowTemplate) => {
        if (res) {
          this.WorkflowTemplateData = res;
          this.router.navigate(['gen-form']);
          this.utilities.notifySuccess("Work Flow Added Successfully");
          this.isDisabled = true;
        }
      }, (err) => {
        this.utilities.notifyError("Something Wrong Happened.")
      })
    }
  }

}
