import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUserRoles } from 'src/app/core/services/app-user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { CommentComponent } from 'src/app/pages/shared/comment/comment.component';

@Component({
  selector: 'app-document-review',
  templateUrl: './document-review.component.html',
  styleUrls: ['./document-review.component.scss']
})

export class DocumentReviewComponent implements OnInit {

  @Input() documentid;
  @Input() formType;
  label: string;
  detailsData: any;
  isApprove: boolean;
  propBtnsFlag: boolean = true;

  constructor(
    private apiService : ApiService, private utilitiesService: UtilitiesService, private dateService: DateService,
    private router: Router, private dialogService: DialogService, private activatedRouteService: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.apiService.get(ApiURL.documentss + '/' + this.documentid).subscribe(res => {
      this.detailsData = res;
      this.propBtnsFlag = true;
      this.getUserRole();
    })
  }

  async getUserRole() {
    let user = await this.utilitiesService.getCurrentAppUser();
    user.roles.forEach(role => {
      this.apiService.get(ApiURL.inboxes + '?formId.equals=' + this.documentid).subscribe((result) => {
        if ((result[0].unread == true) && (result[0].assignedToId == user.userId)) {
            this.isApprove = false;
        } else {
          this.isApprove = true;
        }
      })
    })
  }

  onPreviousStep(): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(CommentComponent, {
        width: '35%',
        data: {
          label: 'Previous Status',
          id: this.detailsData.id,
          properties: this.detailsData,
        },
      });
    })
  }

  onNextStep(): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(CommentComponent, {
        width: '35%',
        data: {
          label: 'Next Status',
          id: this.detailsData.id,
          properties: this.detailsData,
        },
      });
    })
  }

}
