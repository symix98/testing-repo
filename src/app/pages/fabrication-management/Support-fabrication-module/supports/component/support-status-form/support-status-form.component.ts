import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { SupportStatusRefModel } from 'src/app/core/models/support-fab-models/SupportStatusRef.model';
import { SupportStatusModel } from 'src/app/core/models/support-fab-models/support/SupportStatus.model';
import { SupportsModel } from 'src/app/core/models/support-fab-models/supports.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AppUserRoles } from 'src/app/core/services/app-user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-support-status-form',
  templateUrl: './support-status-form.component.html',
  styleUrls: ['./support-status-form.component.scss']
})
export class SupportStatusFormComponent implements OnInit {

  constructor(
    private apiService : ApiService,
    private utilitiesService : UtilitiesService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig : DynamicDialogConfig
  ) { }

  statusForm:SupportStatusModel = new SupportStatusModel()
  statusRefModel :SupportStatusRefModel
  support : SupportsModel
  supportClone : SupportsModel
  selectedStatus : SupportStatusRefModel
  ngOnInit(): void {

    if(this.dialogConfig.data){
      this.support = this.dialogConfig.data
      this.supportClone = {...this.support}
    }
    let query:ApiQuery = new ApiQuery()
    query.size = 1000
    this.apiService.get(ApiURL.status_refs,query).subscribe((res:SupportStatusRefModel) =>{
      this.statusRefModel = res
    })
  }

  async submitForm(){
   
    let user:AppUsers = await this.utilitiesService.getCurrentAppUser()
    this.statusForm.status = this.selectedStatus.status
    this.statusForm.supportHeaders = this.supportClone
    delete this.statusForm.supportHeaders.supportDetails
    delete this.statusForm.supportHeaders.supportLocation
    delete this.statusForm.supportHeaders.supportParents
    delete this.statusForm.supportHeaders.supportStatuses


    this.statusForm.modifyBy = user.name
    this.statusForm.modifyDate = new Date()
    user.roles.forEach(role =>{
      if(role.roleId == AppUserRoles.Subcontractor){
        this.statusForm.isSubcontractor = true
      }
      else{
        this.statusForm.isCCC = true
      }

    })
    this.apiService.post(ApiURL.support_statuses, this.statusForm).subscribe( res =>{
      this.utilitiesService.notifySuccess('Status Added Successfully!')
      this.dialogRef.close(true)
    },
    (err) =>{
      this.utilitiesService.notifyError(err.error.details)
    }
      
    )

  }

}
