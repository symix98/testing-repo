import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUserRoles } from 'src/app/core/services/app-user.service';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { WorkFlowService } from 'src/app/core/services/work-flow.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';


@Component({
  selector: 'app-fabricate',
  templateUrl: './fabricate.component.html',
  styleUrls: ['./fabricate.component.scss']
})

export class FabricateComponent implements OnInit {

  constructor(
    private router: Router, private apiService: ApiService,
    private workFlowService : WorkFlowService, private utilitiesService: UtilitiesService
  ) { }

  generalObj: { area: string, location: string, description: string } = { area: null, location: null, description: null };
  response: any;
  formTypes: any;
  selectType: any;
  uploadedDocs: any[] = [];
  isloading: boolean = false;

  ngOnInit(): void {
    this.isloading = true;

    this.formTypes = [
      { label: 'Material Requisition', value: 'MaterialRequisition' },
      { label: 'Generic Type', value: 'GenericType' },
      { label: 'Generic', value: 'Generic' },
      { label: 'Image', value: 'Image' }
    ]

    this.isloading = false;
  }

  onEdited(e) { }

  onFormChange(event: any) { }

  onList() { this.router.navigate(['fab-init/fab-list']); }

  async initWorkflowProcess(details) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = { 
      "formId": details.id,
      "formType": this.selectType,
      "initiationTime": new Date(),
      "initiatedByUserId": user.userId,
    }
    this.apiService.put(ApiURL.workflow_steps + '/' + details.id, data).subscribe(res => { })
  }

  onSubmitRequest() {
    this.selectType = this.selectType ? this.selectType : null;

    if (this.selectType != null) {
      if (this.generalObj) {
        this.workFlowService.addFormDetails(this.generalObj).subscribe(res => {
          this.response = JSON.parse(JSON.stringify(res));
          this.initWorkflowProcess(res);
          this.utilitiesService.notifySuccess("Details Successfully Submitted")
          this.router.navigate(['fab-init/fab-list']);
        }, (err) => {
          this.utilitiesService.notifyError("Please Retry to submit")
        })
      }
    } else {
      this.utilitiesService.notifyError("Please fill the fields")
    }
  }

}
