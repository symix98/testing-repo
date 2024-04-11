import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ProjectSettings, ValueType } from 'src/app/core/models/project-settings.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit, OnDestroy {

  tabsIndex: number = 0;

  settings: any[] = [];
  settingsValueType = ValueType;
  projectSettingsForm: FormGroup;
  projectSettings: any[];
  subscriptions: Subscription = new Subscription();
  loading: boolean = true;
  editing: boolean = false;
  weldTypes = [];
  suggestionValue: any[];
  booleanTypeValue: ProjectSettings = new ProjectSettings();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder) {
    this.initForm();
    this.getProjectSettings();
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    this.projectSettingsForm = this.fb.group([]);
  }

  getProjectSettings() {
    let query: ApiQuery = null;
    query = {
      sort: ['id,asc']
    }
    this.subscriptions.add(this.apiService.get(ApiURL.project_setting, query).subscribe((result: ProjectSettings[]) => {
      this.projectSettings = result;
      for (let i = 0; i < result.length; i++) {
        const index = this.settings.findIndex(x => x.tab == result[i].category);
        //if we don't have a tab with same category header add it else use same header but add the result settings
        if (index < 0) {
          let setting: any = {};
          setting.tab = result[i].category;
          setting.settings = [result[i]];
          this.settings.push(setting);
        }
        else {
          this.settings[index].settings.push(result[i]);
        }
      }

      if (this.tabsIndex == 0)
        this.addControls(this.tabsIndex);
      this.loading = false;
    }));
  }
  handleBooleanChange(e, detail) {
    let ischecked = e.checked;
    detail.value = ischecked;
    this.booleanTypeValue = detail;
  }

  watchWeldType(propertyName) {
    this.subscriptions.add(this.projectSettingsForm.get(propertyName).valueChanges.subscribe((data) => {

      const property = this.settings[this.tabsIndex].settings.find(x => x.property == propertyName);
      if (data && property.isMultiple) {
        const suggestionValue = data.map(x => x.value)
        let stringValues = suggestionValue.join(',')
        property.value = stringValues;
        this.suggestionValue = property;
      }
    }))
  }

  updateProjectSettings(detail, id) {
    const url = `${ApiURL.project_setting}/${id}`
    this.subscriptions.add(this.apiService.put(url, detail).subscribe((data) => {
      this.editing = false;
      this.watchForm()
    }, () => {
      this.loading = false;
    }));
  }
  
  save(setting) {
    setting.map(item => {
      if (item) {
        let property = item.property;
        if (item.valueType == ValueType.booleanType) {
          if (this.booleanTypeValue.value)
            item = this.booleanTypeValue;
        }
        else if (item.valueType == ValueType.stringType && item.isMultiple) {
          if (this.suggestionValue)
            item = this.suggestionValue;
        } else {
          let value = this.projectSettingsForm.get(property).value;
          item.value = value;
        }
        this.updateProjectSettings(item, item.id)
      }
    })
  }

  tabsChanged(e) {
    this.tabsIndex = e.index;
    this.addControls(this.tabsIndex);
  }

  addControls(index) {
    this.projectSettingsForm = this.fb.group([]);

    // Set Default Form Controls For First Tab (Tab index = 0)
    for (let i = 0; i < this.settings[index].settings.length; i++) {
      const dropdownControl = this.settings[index].settings[i].valueType == ValueType.stringType;
      let value = this.settings[index].settings[i].value;
      let isMultiple = this.settings[index].settings[i].isMultiple;
      let suggestionsDefaultValue = []
      if (dropdownControl && value && isMultiple) {
        let weldTypeValues = value.split(',');
        for (let item of weldTypeValues) {
          let obj = { value: item }
          suggestionsDefaultValue.push({ ...obj })
        }
      }
      value = this.settings[index].settings[i].valueType == ValueType.booleanType ? Boolean(value) : value;
      this.projectSettingsForm.addControl(this.settings[index].settings[i].property, new FormControl(!isMultiple ? value : suggestionsDefaultValue, Validators.required));
      //Watch inputs that contain objects not classic input types
      if (dropdownControl) {
        this.watchWeldType(this.settings[index].settings[i].property);
      }
    }
    this.projectSettingsForm.updateValueAndValidity();
    this.watchForm();


  }

  edit() {
    this.editing = !this.editing;
    this.watchForm()
  }

  watchForm() {
    if (!this.editing) {
      this.projectSettingsForm.disable()
    }
    else {
      this.projectSettingsForm.enable();
    }
  }
}