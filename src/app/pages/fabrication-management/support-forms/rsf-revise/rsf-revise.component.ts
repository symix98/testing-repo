import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';


@Component({
  selector: 'app-rsf-revise',
  templateUrl: './rsf-revise.component.html',
  styleUrls: ['./rsf-revise.component.scss']
})

export class RsfReviseComponent implements OnInit {

  msg: string;
  header: any;
  isRevise: boolean = false;

  constructor(public ref: DynamicDialogRef, private apiService: ApiService, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.header = this.config.data.header;
  }

  Revise() {
    this.isRevise = true
    this.config.closable = false;
    this.config.closeOnEscape = false;
    let data = {
      formId: this.header.id,
      formType: this.config.data.formType,
      email: this.config.data.email,
      toEmail: this.config.data.toEmail,
      msg: this.msg
    }
    this.apiService.post(ApiURL.workflow_revise + '/' + data.email + '/' + data.toEmail, data).subscribe(res => {      
      this.ref.close(res);
    })
  }
  
}
