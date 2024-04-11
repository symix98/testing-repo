import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api.service';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { DateService } from 'src/app/core/services/date.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppUserRoles } from 'src/app/core/services/app-user.service';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { RsfAssignComponent } from '../../rsf-assign/rsf-assign.component';
import { FormType } from 'src/app/core/miscellaneous/global-props.template';
import { FormTypes } from 'src/app/core/models/support-forms-models/form-types.enum';
import { selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { SupportForms } from 'src/app/core/models/support-forms-models/support-form.model';
import { SupportFormFields } from 'src/app/core/models/support-forms-models/support-form-fields.model';
import { SupportHeadersModel } from 'src/app/core/models/support-fab-models/support/SupportHeaders.model';


@Component({
  selector: 'app-rsf-form',
  templateUrl: './rsf-form.component.html',
  styleUrls: ['./rsf-form.component.scss'],
})

export class RsfFormComponent implements OnInit {

  user: AppUsers;
  @Input() id: string;
  isDisabled: boolean = false;
  isSubmitting: boolean = false;
  formFields: SupportFormFields;
  subscriptions = new Subscription();
  selectSupports: SupportHeadersModel [];
  rsfFormFields: SupportFormFields[] = [];
  @ViewChild('rsfForm', { static: false }) rsfForm!: NgForm;

  constructor(
    private apiService: ApiService, private dialogService: DialogService,
    private dateService: DateService, private utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.isDisabled = true
      this.getFormFields()
    } else {
      this.rsfFormFields.push(
        { fieldName: 'order_no', fieldType: FormTypes.formString, fieldOptions: '', fieldOrder: 1, isRequired: true },
        { fieldName: 'rev_no', fieldType: FormTypes.formString, fieldOptions: '', fieldOrder: 2, isRequired: true },
        { fieldName: 'date', fieldType: FormTypes.formDate, fieldOptions: new Date(), fieldOrder: 3, isRequired: true },
        { fieldName: 'supplier', fieldType: FormTypes.formString, fieldOptions: '', fieldOrder: 4, isRequired: true },
        { fieldName: 'mrNo', fieldType: FormTypes.formString, fieldOptions: '', fieldOrder: 5, isRequired: true },
        { fieldName: 'delvDate', fieldType: FormTypes.formDate, fieldOptions: '', fieldOrder: 6, isRequired: true },
        { fieldName: 'weight', fieldType: FormTypes.formNumber, fieldOptions: '', fieldOrder: 7, isRequired: true }
      )
    }
  }

  getFormFields() {
    let query = new ApiQuery();
    query.filter = new Map<string, string>([['formId', this.id]])
    query.sort = ["fieldOrder,asc"]
    this.apiService.get(ApiURL.form_fields, query).subscribe(
      (res) => {
        this.rsfFormFields = res;
        this.rsfFormFields.forEach(ele =>{
          if(ele.fieldType == FormTypes.formDate){
            ele.fieldOptions = new Date(ele.fieldOptions)
          }
        })
      },
      (err) => {
        this.utilitiesService.notifyError(err.error.details);
      }
    );
  }

  async addRsfForm() {

    let user = await this.utilitiesService.getCurrentAppUser();
    let form: SupportForms = new SupportForms();

    form = {
      formName: this.rsfFormFields[0].fieldOptions,
      formDescription: 'Request Support Fabrication',
      status: 'Open',
      formType: FormType.RSF,
      createdBy: user.name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.rsfFormFields.forEach(field => {
      field.form = form
      if (field.fieldType == FormTypes.formDate) {
        field.fieldOptions = this.dateService.systemDateFormat(field.fieldOptions)
      }
    })

    let obj = {
      fields: this.rsfFormFields,
      supports: this.selectSupports
    }

    this.onAccepted(obj)

  }

  async creatWorkflowProcess(detail, toUser) {
    let user = await this.utilitiesService.getCurrentAppUser();
    let data = {
      formId: detail.id,
      initiationTime: new Date(),
      formType: detail.formType,
      initiatedByUserId: user.userId
    }
    this.apiService.post(ApiURL.formflow_steps + '/' + detail.id+ '/' + toUser.email, data).subscribe(res => { })
  }

  onAccepted(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(RsfAssignComponent, {
        data: {
          selectionMode: selectionMode.single,
          role: AppUserRoles.fab_shop,
        },
        header: 'Choose Fabrication Engineer',
        width: '80%'
      });
      this.subscriptions.add(ref.onClose.subscribe(async (result: AppUsers) => {
        if (result) {
          this.user = result;
          this.saveRequest(obj, this.user)
        }
      }))
    })
  }

  async saveRequest(obj, user) {
    this.isSubmitting = true;
    this.apiService.post(ApiURL.forms_supports, obj).subscribe(
      (res) => {
        this.creatWorkflowProcess(res, user);
        this.utilitiesService.notifySuccess('Form Fields Added Successfully!')
        this.rsfForm.resetForm();
      },
      (err) => {
        this.utilitiesService.notifyError(err.error.details);
      }
    )
  }

  onSupportAdded(e) {
    this.selectSupports = e
    let totalWt = 0
    this.selectSupports.forEach(sup =>{
      totalWt = totalWt +  sup.supWT
    })
    this.rsfFormFields[6].fieldOptions = totalWt
  }

}
