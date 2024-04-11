import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';

@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.scss']
})
export class AddDocumentsComponent implements OnInit {

  tableParam: TableParameter;
  transmittalDocuments: any[] = [];

  constructor(private ref: DynamicDialogRef,) { }

  ngOnInit(): void {
    this.initTableParam();
  }

  saveDocuments() {
    this.ref.close(this.transmittalDocuments)
  }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.api = ApiURL.documentss;
    param.dataKey = 'id';
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.showToggler = false;
    param.scrollHeight = '65vh';
    param.selectionMode = selectionMode.mulitple;
    param.onCheckBoxSelected = this.onRowSelected;
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] = [
      {
        title: 'documentsNumber',
        field: 'documentsNumber',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'documentsNumber',
        },
      },
      {
        title: 'revision',
        field: 'revision',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'revision',
        },
      },
      {
        title: 'revisionDate',
        field: 'revisionDate',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'revisionDate' },
      },
      {
        title: 'version',
        field: 'version',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'version' },
      },
      {
        title: 'title',
        field: 'title',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'title' },
      },
      {
        title: 'phase',
        field: 'phase',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'phase',
        },
      },
      {
        title: 'classes',
        field: 'classes',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'classes' },
      },

      {
        title: 'documentsFor',
        field: 'documentsFor',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'documentsFor' },
      },

      {
        title: 'initiatedBy',
        field: 'initiatedBy',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'initiatedBy' },
      },

      {
        title: 'disciplines',
        field: 'disciplines',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'disciplines' },
      },

      {
        title: 'replyRequired',
        field: 'replyRequired',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'replyRequired' },
      },

      {
        title: 'replyRequiredBy',
        field: 'replyRequiredBy',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'replyRequiredBy',
        },
      },

      {
        title: 'tqStatus',
        field: 'tqStatus',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'tqStatus' },
      },

      {
        title: 'workflow',
        field: 'workflow',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'workflow' },
      },

      {
        title: 'isTransmitted',
        field: 'isTransmitted',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'isTransmitted' },
      },
      {
        title: 'isTransmitted',
        field: 'isTransmitted',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'isTransmitted' },
      },
      {
        title: 'isTransmitted',
        field: 'isTransmitted',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'isTransmitted' },
      },
      {
        title: 'sstatus',
        field: 'sstatus',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'sstatus' },
      },
      {
        title: 'confidential',
        field: 'confidential',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'confidential' },
      },
      {
        title: 'additionalReference',
        field: 'additionalReference',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'additionalReference',
        },
      },
      {
        title: 'reviewStatus',
        field: 'reviewStatus',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'reviewStatus' },
      },
      {
        title: 'modelReference',
        field: 'modelReference',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'modelReference' },
      },
      {
        title: 'createdBy',
        field: 'createdBy',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'createdBy' },
      },
      {
        title: 'dateModified',
        field: 'dateModified',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'dateModified' },
      },
      {
        title: 'activityID',
        field: 'activityID',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'activityID' },
      },
      {
        title: 'jobNumber',
        field: 'jobNumber',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'jobNumber' },
      },
    ];
    return tableColumns;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.transmittalDocuments = event;
      resolve();
    });
  };

}
