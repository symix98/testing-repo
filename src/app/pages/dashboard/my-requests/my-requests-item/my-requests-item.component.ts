import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DateService } from 'src/app/core/services/date.service';
import { Subscription } from 'rxjs';
import { WorkflowProcess } from 'src/app/core/models/workflow-process.model';
import { Component, OnInit, Input } from '@angular/core';
import { DateAgo, FormType } from 'src/app/core/miscellaneous/global-props.template';

@Component({
  selector: 'app-my-requests-item',
  templateUrl: './my-requests-item.component.html',
  styleUrls: ['./my-requests-item.component.scss']
})
export class MyRequestsItemComponent implements OnInit {

  @Input() workflowProcess: WorkflowProcess;
  formStatus: any;
  dateString: string;
  statusClass: string;

  subscription = new Subscription();

  constructor(public dateService: DateService, private utilitiesService: UtilitiesService, private apiService: ApiService, private router: Router) { }


  ngOnInit(): void {
    this.getTimeString();
  }



  getTimeString() {
    if (DateAgo.Today === this.dateService.dateAgo(this.workflowProcess.initiationTime)) {
      this.dateString = "Today - " + this.dateService.timeFromNow(this.workflowProcess.initiationTime);
    } else if ((DateAgo.Yesterday === this.dateService.dateAgo(this.workflowProcess.initiationTime)) || (DateAgo.Two_Days_Ago === this.dateService.dateAgo(this.workflowProcess.initiationTime))) {
      this.dateString = this.dateService.dateAgo(this.workflowProcess.initiationTime) + " - " + this.dateService.extractTimeFromDate(this.workflowProcess.initiationTime);
    } else if (DateAgo.Earlier === this.dateService.dateAgo(this.workflowProcess.initiationTime)) {
      this.dateString = this.dateService.convertDate(this.workflowProcess.initiationTime);
    }
  }

  async openForm(args: WorkflowProcess) {
    let routeId = '';
    const param =
    {
      formId: args.formId
    };

    if (args.formType) {
      if (args.formType === FormType.Default) {
        routeId = 'default/default-form';
      }
      this.router.navigate([routeId, param]);
    }
  }

}
