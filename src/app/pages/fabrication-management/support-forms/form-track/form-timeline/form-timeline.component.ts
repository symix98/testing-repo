import { PrimeIcons } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { DateService } from 'src/app/core/services/date.service';
import { previewService } from 'src/app/core/services/preview.service';


@Component({
  selector: 'app-form-timeline',
  templateUrl: './form-timeline.component.html',
  styleUrls: ['./form-timeline.component.scss']
})

export class FormTimelineComponent implements OnInit {

  @Input() formId;
  @Input() data;
  step: any[] = [];
  actDesc: any[] = [];
  comment: any;
  events: any[];
  processId: any;
  formType: string;
  qcRevisedby: any;
  qcRevisedTo: any;
  curentStep: number;
  templateData: any;
  submAssignedBy: any;
  submAssignedTo: any;
  qcAppAssignedTo: any;

  isLoading:boolean = false;

  constructor(
    private dateService: DateService,
     private apiService : ApiService,
     private previewservice: previewService,
     private activatedRouteService : ActivatedRoute ) { }

  ngOnInit(): void {
    this.formType = this.data.formType;
    this.getFormProcess();
  }

  getFormProcess() {
    let query: ApiQuery = null;
    query = {
      filter: new Map<any, any>([['formId', this.formId]]),
    }
    this.apiService.get(ApiURL.workflow_processes, query).subscribe((res) => {
      let pId = [];
      pId = res;
      pId.forEach((e) => {
        e.id;
        this.processId = e.id;
      });
      if (pId.length > 0) {
        this.getFormStep()
      } else {
        // this.getEmptyProcess()
      }
      console.log(res)
    });
  }

  getFormStep() {
    let query: ApiQuery = null;
    query = {
      filter: new Map<any, any>([['workflowProcessId', this.processId]]),
      sort: ["id,asc"]
    }
    this.apiService.get(ApiURL.workflow_steps, query).subscribe((res) => {
      this.curentStep = res.length - 1;
      this.getEvent(res)
    })
  }

  getEvent(steps: any[]) {
    this.step = [];
    this.actDesc = []
    let query: ApiQuery = null;
    query = {
      sort: ["sequence,asc"]
    }
    this.apiService.get(ApiURL.inboxes + '?formId.equals=' + this.formId).subscribe((result) => {

      let assignedTo = result
      assignedTo.forEach(e => {
        if (e.title == 'Initiation') {
          this.submAssignedBy = e.assignedByName
        } else if (e.title == 'InProgress') {
          this.submAssignedTo = e.assignedByName
        } else if (e.title == 'Completed') {
          this.qcAppAssignedTo = e.assignedToName
        } else if (e.title == 'Revise') {
          this.qcRevisedby = e.assignedToName
          this.qcRevisedTo = e.assignedByName
          this.comment = e.description
        }
      });

      this.apiService.get(ApiURL.workflow_templates + '?formType.equals=' + this.formType, query).subscribe((res) => {
        this.templateData = res
        this.templateData.forEach((ele) => {
          this.step.push(ele.stepName);
          this.actDesc.push(ele.actionDescription)
        });
        this.events = [];
        this.step.forEach((s, i) => {
          if (i == 0) {
            this.events.push({
              sequence: i + 1,
              stepName: s,
              date: steps[i] ? this.dateService.convertDatetime(steps[i]?.triggerTime) : null,
              color: this.curentStep >= i ? '#2196f3' : '#c6c3bd',
              subAssigned: this.submAssignedBy,
              revise: this.qcRevisedby,
              reviseto: this.qcRevisedTo,
              comment: this.comment,
            })
          }
          if (i == 1) {
            this.events.push({
              sequence: i + 1,
              stepName: s,
              date: steps[i] ? this.dateService.convertDatetime(steps[i]?.triggerTime) : null,
              color: this.curentStep >= i ? '#2196f3' : '#c6c3bd',
              appAssigned: this.submAssignedTo,
              revise: this.qcRevisedby,
              reviseto: this.qcRevisedTo,
              comment: this.comment,
            })
          }
          if (i == 2) {
            this.events.push({
              sequence: i + 1,
              stepName: s,
              date: steps[i] ? this.dateService.convertDatetime(steps[i]?.triggerTime) : null,
              color: this.curentStep >= i ? '#2196f3' : '#c6c3bd',
              appAssigned: this.qcAppAssignedTo,
              comment: this.comment,
            })
          }
          if (i == 3) {
            this.events.push({
              sequence: i + 1,
              stepName: s,
              date: steps[i] ? this.dateService.convertDatetime(steps[i]?.triggerTime) : null,
              color: this.curentStep >= i ? '#2196f3' : '#c6c3bd',
              comment: this.comment,
              // appAssigned: this.submAssignedTo
            })
          }
        })
        console.log(this.events)
      })

    })
  }

  DownloadFormPdf(id: any){
    this.isLoading =true
    this.previewservice.getjasperReport("pdf", id).subscribe((response:any)=>{

      let filename = "RSF Form"
      let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            this.isLoading =false
            
    })
  }

}
