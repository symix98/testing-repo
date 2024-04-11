import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkFlowService } from 'src/app/core/services/work-flow.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';


@Component({
  selector: 'app-fab-tracker',
  templateUrl: './fab-tracker.component.html',
  styleUrls: ['./fab-tracker.component.scss']
})

export class FabTrackerComponent implements OnInit {

  data: any;
  message: string;
  headerid: string;
  detailsData: any;
  isRevise: boolean = false;

  constructor(
    private activatedRouteService: ActivatedRoute,
    private router: Router, private apiService: ApiService,
    private workFlowService: WorkFlowService, private utilitiesService: UtilitiesService
    ) { }

  ngOnInit(): void {

    this.headerid = this.activatedRouteService.snapshot.paramMap.get('id');
    this.workFlowService.getDetailById(this.headerid).subscribe(res => {
      this.detailsData = res;
    })

    this.apiService.get(ApiURL.workflow_processes + '?formId.in=' +  this.headerid).subscribe(res => {
      this.data = res;
    })

  }

  async onApprove() {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = { 
      formId: this.headerid,
      formType: this.data[0].formType,
      email: user.email,
    }
    if (this.detailsData) {
      this.apiService.post(ApiURL.workflow_approve + '/' + user.email, data).subscribe(res => {
        this.utilitiesService.notifySuccess("Form Approved")
        this.router.navigate(['fab-init/fab-list']);
      }, (err) => {
        this.utilitiesService.notifyError("Something Wrong Happend!")
      })
    }
  }

  async onRevise() {
    let user = await this.utilitiesService.getCurrentAppUser();
    this.isRevise = true;
    let data = {
      formId: this.headerid,
      formType: this.data[0].formType,
      email: user.email,
    }
    if (this.detailsData) {
      this.apiService.post(ApiURL.workflow_revise + '/' + user.email, data).subscribe(res => {
        console.log(res)
        this.utilitiesService.notifySuccess("Form Rejected")
        this.router.navigate(['fab-init/fab-list']);
      }, (err) => {
        this.utilitiesService.notifyError("something wrong Happend!")
      })
    }
  }

}
