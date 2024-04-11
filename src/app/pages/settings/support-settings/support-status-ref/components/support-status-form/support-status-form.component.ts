import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { SupportStatusRefModel } from 'src/app/core/models/support-fab-models/SupportStatusRef.model';
import { ApiService } from 'src/app/core/services/api.service';
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
    private dialogRef: DynamicDialogRef
  ) { }

  statusForm:SupportStatusRefModel = new SupportStatusRefModel()
  ngOnInit(): void {
  }

  async submitForm(){
    let user = await this.utilitiesService.getCurrentAppUser()
    this.statusForm.modifyBy = user.name
    this.statusForm.modifyDate = new Date()
    this.apiService.post(ApiURL.support_rsf_forms, this.statusForm).subscribe( res =>{
      this.utilitiesService.notifySuccess('Status Added Successfully!')
      this.dialogRef.close(true)
    },
    (err) =>{
      this.utilitiesService.notifyError(err.error.details)
    }
      
    )

  }

}
