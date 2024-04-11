import { TreeNode } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from '../../../core/miscellaneous/api.template';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { AddWorkFlowStepComponent } from '../add-work-flow-step/add-work-flow-step.component';


@Component({
  selector: 'app-work-flow-list',
  templateUrl: './work-flow-list.component.html',
  styleUrls: ['./work-flow-list.component.scss']
})

export class WorkFlowListComponent implements OnInit {

  title = '';
  isloading = false;
  tableData: TreeNode[];
  selectedFormType = '';
  transformedData: any[] = [];

  constructor(
    private router: Router, private dialogService: DialogService,
    private apiService: ApiService, private activatedRouteService: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isloading = true;
    this.selectedFormType = this.activatedRouteService.snapshot.paramMap.get('formType');
    let query: ApiQuery = null;
    query = { sort: ['id,asc'] }
    this.apiService.get(ApiURL.workflow_templates + '?formType.in=' + this.selectedFormType, query).subscribe(res => {
      this.tableData = this.transformData(res);
    })
    this.isloading = false;
  }

  transformData(inputData: any[]): any[] {
    
    const transformedData = [
      {
        label: this.selectedFormType,
        children: [],
      }
    ];

    const traverse = (data, index) => {
      if (index >= inputData.length)
       return;
      const newItem = {
        label: inputData[index].stepName,
        children: [],
      };
      data.push(newItem);
      traverse(newItem.children, index + 1);
    };
    traverse(transformedData[0].children, 0);
    return transformedData;
  }

  back() {
    this.router.navigate(['gen-form'])
  }

  addNewStep(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddWorkFlowStepComponent, {
        width: '80%', height: 'auto',
        styleClass: 'my-dialog-class',
        data: {
          formType: this.selectedFormType,
        },
        header: 'Selected Form Type is ' + this.selectedFormType,
      });
      ref.onClose.subscribe(res => {
        if (res) {
          setTimeout(() => {
            this.ngOnInit();
          }, 10);
          resolve();
        } else {
          resolve();
        }
      })
    })
  }

  onNodeSelect(event): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.selectedFormType == event.node.label) {
        this.title = 'Selected Form Type is ' + this.selectedFormType;
      } else {
        this.title = 'Selected Form Type is ' + this.selectedFormType + ' & Step Name is ' + event.node.label;
      }
      const ref = this.dialogService.open(AddWorkFlowStepComponent, {
        width: '80%', height: 'auto',
        styleClass: 'my-dialog-class',
        data: {
          formType: this.selectedFormType,
          stpName: event.node.label,
        },
        header: this.title,
      });
      ref.onClose.subscribe(res => {
        if (res) {
          setTimeout(() => {
            this.ngOnInit();
          }, 10);
          resolve();
        } else {
          resolve();
        }
      })
    })
  }

}
