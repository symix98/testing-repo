import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { WorkFlowService } from 'src/app/core/services/work-flow.service';


@Component({
  selector: 'app-gen-form',
  templateUrl: './gen-form.component.html',
  styleUrls: ['./gen-form.component.scss']
})

export class GenFormComponent implements OnInit {

  constructor( private router: Router, private workFlowService : WorkFlowService, ) { }

  cols: any[];
  isSelected: any[] = [];
  formTypes: string[] = [];
  isloading: boolean = false;
  isAddingForm: boolean = false;
  isInputDisabled: boolean = false;
  formTypeData: { formType: string, steps: number }[] = [];

  ngOnInit(): void {
    this.isloading = true;
    this.workFlowService.getAllWorkFlowTemplates().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        this.extractFormTypes(res);
        for (let i = 0; i < this.formTypes.length; i++) {
          let count = 0;
          for (let j = 0; j < res.length; j++) {
            if (this.formTypes[i] == res[j].formType) {
              count++;
            }
          }
          this.formTypeData.push({ formType: this.formTypes[i], steps: count });
        }
      }
    })
    this.isloading = false;
  }

  AddNewForm() {
    this.isAddingForm = true
    let param = { id: 'new' };
    this.router.navigate(['gen-form/add-flow-step', param]);
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      let parm = { formType: event.data.formType }
      this.router.navigate(['gen-form/work-flow-list', parm]);
      resolve();
    });
  }

  extractFormTypes(data: any[]) {
    const formTypesSet = new Set<string>();
    data.forEach((item: any) => {
      const formType = item.formType;
      if (formType) { formTypesSet.add(formType); }
    });
    this.formTypes = Array.from(formTypesSet);
  }

}
