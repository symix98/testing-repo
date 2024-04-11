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
import { RsfAssignComponent } from '../../rsf-assign/rsf-assign.component';
import { RsfReviseComponent } from '../../rsf-revise/rsf-revise.component';
import { selectionMode } from 'src/app/core/models/table-model/table-parameter.model';


@Component({
  selector: 'app-form-review',
  templateUrl: './form-review.component.html',
  styleUrls: ['./form-review.component.scss']
})

export class FormReviewComponent implements OnInit {

  @Input() dataid;
  @Input() formType;
  detailsData: any;
  isApprove: boolean;
  createBy: AppUsers;
  assignedById: String;
  isFabUser: boolean = false;
  isSubContractor: boolean =false;
  subscriptions = new Subscription();

  constructor(
    private apiService : ApiService, private utilitiesService: UtilitiesService, private dateService: DateService,
    private router: Router, private dialogService: DialogService, private activatedRouteService: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.apiService.get(ApiURL.form + '/' + this.dataid).subscribe(res => {
      this.detailsData = res;
      this.getUserRole();
      this.getAssignedbyData()
    })
  }

  async getUserRole() {
    let user = await this.utilitiesService.getCurrentAppUser();
    console.log(user)
    user.roles.forEach(role => {
      if (role.roleId == AppUserRoles.fab_shop) {
        this.isFabUser = true;
      }
      if (role.roleId == AppUserRoles.Subcontractor) {
        this.isSubContractor = true;
      }
      this.apiService.get(ApiURL.inboxes + '?formId.equals=' + this.dataid).subscribe((result) => {
        if ((result[0].unread == true) && (result[0].assignedToId == user.userId)) {
            this.isApprove = false;
        } else {
          this.isApprove = true;
        }
        // console.log( 'Fab -- ' + this.isFabUser + ' Sub --- ' + this.isSubContractor + ' Approved --- ' + this.isApprove)
      })
    })
  }

  getAssignedbyData() {
    this.apiService.get(ApiURL.appusers + '?name.equals=' + this.detailsData.createdBy).subscribe((res: AppUsers) => {
        this.createBy = res[0].email
      }, (err) => { })
  }

  onApprove(): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(RsfAssignComponent, {
        data: {
          selectionMode: selectionMode.single,
          role: AppUserRoles.Subcontractor,
        },
        header: "Assign To Sub Contractors",
        width: '60%'
      });
      this.subscriptions.add(ref.onClose.subscribe((result: AppUsers) => {
        if (result) {
          this.nextStep(result.email)
        }
      }))
    })
  }

  async nextStep(toEmail) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = {
      formId: this.dataid,
      email: user.email,
      toEmail: toEmail,
      formType: this.detailsData.formType,
    }
    if (this.isFabUser) {
      this.apiService.post(ApiURL.workflow_approve + '/' + user.email + '/' + toEmail, data).subscribe(res => {
        this.utilitiesService.notifySuccess('RSF Form Approved')
        this.router.navigate(['']);
      }, (err) => {
        this.utilitiesService.notifyError('Something Wrong Happend!')
      })
    }
  }

  async onRevise() {
    let user = await this.utilitiesService.getCurrentAppUser();
    this.dialogService.open(RsfReviseComponent, {
      data: {
        header: this.detailsData,
        email: user.email,
        toEmail: this.createBy,
        formType: this.detailsData.formType,
      },
      closeOnEscape: false,
      header: 'Revise',
    }).onClose.subscribe(res => {
      if (res)
        this.updateStatusRevise()
    })
  }

  updateStatusRevise() {
    let state = this.detailsData;
    state.status = 'ToRevise';
    state.updatedAt = new Date();
    this.apiService.patch(ApiURL.form + '/' + this.dataid, state).subscribe(res => {
      this.utilitiesService.notifySuccess("RSF Form Rejected")
      this.router.navigate(['']);
    }, (err) => {
      this.utilitiesService.notifyError('Something Wrong Happend!')
    })
  }

  onAccept(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let user = await this.utilitiesService.getCurrentAppUser();
      if (this.isSubContractor) {

      }
      this.dialogService.open(RsfReviseComponent, {
        data: {
          header: this.detailsData,
          email: user.email,
          toEmail: this.createBy,
          formType: this.detailsData.formType,
        },
        closeOnEscape: false,
        header: 'Approve',
      });

      // this.subscriptions.add(ref.onClose.subscribe((result) => {
      //   if (result) {
      //     //console.log(result)
      //     this.apiService.get(ApiURL.rfi_headers + "/" + this.headerid).subscribe(res => {
      //       if (res?.statuses[0]?.formSatus != StatusModel.Submitted) {
      //         this.utilitiesService.confirmDialog("Already Accepted !").then(res => {
      //           this.router.navigate(['rfi'])
      //         })
      //       } else {
      //         this.inspector = result.ccc?.email
      //         this.client = result.cg?.email
      //         this.CCCClark = result.clark?.email
      //         this.UpdateStatus(user, result.ctjv?.email)
      //         this.isDisplay = true
      //       }

      //     })
      //   }
      // }))
    })
  }

}
