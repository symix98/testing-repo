import { Component, Input, OnInit } from '@angular/core';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-document-timeline',
  templateUrl: './document-timeline.component.html',
  styleUrls: ['./document-timeline.component.scss']
})

export class DocumentTimelineComponent implements OnInit {

  @Input() documentId;
  @Input() data;
  formType: string;
  comment: any;
  events: any[];
  processId: any;
  templateData: any;
  curentStep: number;
  step: any[] = [];
  actDesc: any[] = [];
  submAssignedBy: any;
  submAssignedTo: any;
  qcRevisedby: any;
  qcRevisedTo: any;
  qcAppAssignedTo: any;

  constructor(private dateService: DateService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.formType = this.data.workflow;
    this.getDocumentProgress();
  }

  getDocumentProgress() {
    let query: ApiQuery = null;
    query = {
      filter: new Map<any, any>([['documentId', this.documentId]]),
    }
    this.apiService.get(ApiURL.workflow_processes, query).subscribe((res) => {
      let pId = [];
      pId = res;
      pId.forEach((e) => {
        e.id;
        this.processId = e.id;
      });
      if (pId.length > 0) {
        this.getDocumentStep()
      } else {
        // this.getEmptyProcess()
      }
    });
  }

  getDocumentStep() {
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
    this.apiService.get(ApiURL.inboxes + '?formId.equals=' + this.documentId).subscribe((result) => {
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
            })
          }
        })
      })

    })
  }

}
