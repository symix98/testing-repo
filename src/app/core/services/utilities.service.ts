import { Injectable, isDevMode } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Account } from '../models/account.model';
import { AppUsers } from '../models/app-users.model';
import { ApiService } from './api.service';
import { ApiURL } from '../miscellaneous/api.template';
import { ACCOUNT } from '../miscellaneous/app.constants';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import * as FileSaver from 'file-saver';
import { KeycloakProfile } from 'keycloak-js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import * as XLSX from 'xlsx';
import { ApiQuery } from '../miscellaneous/api-query.template';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {

  user: KeycloakProfile;
  private dialogVisibilitySubject = new Subject<boolean>();
  dialogVisibility$ = this.dialogVisibilitySubject.asObservable();

  setDialogVisibility(visibility: boolean) {
    this.dialogVisibilitySubject.next(visibility);
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    private keycloakService: KeycloakService,
    private api: ApiService,
    private http: HttpClient) {
  }

  notifySuccess(message: String) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: "" + message });
  }

  notifyError(message: String): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: "" + message });
  }

  notifyInfo(message: String): void {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: "" + message });
  }
  
  confirmDialog(message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        message: message,
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    })
  }

  // Enums to Arrays
  enumToArray(obj: any) {
    const array: any[] = [];

    for (const [propertyKey] of Object.entries(obj)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      array.push(propertyKey);
    }

    return array;
  }

  // Check if two objects are equal
  isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length == bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  setLoggedinAccount(account) {
    this.sessionStorageService.store('ACCOUNT', JSON.stringify(account));
  }

  getLoggedinAccount(): Account {
    let res: Account;

    if (this.localStorageService.retrieve('ACCOUNT') == null) {
      res = JSON.parse(this.sessionStorageService.retrieve('ACCOUNT'));
    }
    else {
      res = JSON.parse(this.localStorageService.retrieve('ACCOUNT'));
    }

    return res;
  }

  clearLoggedInAccount() {
    this.sessionStorageService.clear(ACCOUNT);
    this.user = null;
  }

  getCurrentAppUser(): Promise<AppUsers> {
    return new Promise((resolve, reject) => {
      if (this.user == null) {
        let query:ApiQuery = null;
        query = {
          filter: new Map<string, string>([['email', this.getLoggedinAccount().email]])
        }
        this.api.get(ApiURL.appusers, query).subscribe((data) => {
          if(data.length > 0 ){
            this.user = data[0];
            resolve(this.user);
          }
          
        }, () => resolve(null));
      }
      else {
        resolve(this.user);
      }
    });
  }

  deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
      ok(x).every(key => this.deepEqual(x[key], y[key]))
    ) : (x === y);
  }

  truncate(input: string, length: number) {
    if (input.length > length) {
      return input.substring(0, length) + '...';
    }
    return input;
  }

  fileToImage(file): Promise<any> {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result.toString());
      };
    })
  }

  capitalize(s: string): string {
    if (typeof s !== 'string') return '';
    const words = s.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
  }

  saveFileOnDisk(Blob, name) {
    FileSaver.saveAs(Blob, name);
  }

  handleAccountDatasource(account: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (environment.defaultDataSource == "" || environment.defaultDataSource == null) {
        this.http.get<any>(`${environment.appconfig.url}/${account.email}/datasources`)
          .subscribe((response) => {
            let value = response != null ? response.databaseName : null;
            this.sessionStorageService.store('data_session_storage', value);
            resolve(value);
          }, (error) => {
            resolve(null)
          });
      }
      else {
        this.sessionStorageService.store('data_session_storage', environment.defaultDataSource);
        resolve(environment.defaultDataSource);
      };
    });
  }

  logOut() {
    this.sessionStorageService.clear();
    this.keycloakService.logout(environment.appUrl);
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().toLocaleString() + EXCEL_EXTENSION);
  }
  exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
     
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    
}

convertFiletoBase64(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function (e) {
      const resultStr: string = e.target.result.toString();
      const base64Data = resultStr.substr(resultStr.indexOf('base64,') + 'base64,'.length);
      resolve(base64Data)
    }
  });
}

hasEmptyAttributes(form: any): boolean {
  for (const key of Object.keys(form)) {
    if (
      form[key] === null ||
      form[key] < 0 ||
      form[key] === ''
    ) {
      console.log(key);
      this.messageService.add({severity:'error', summary:'Fill All Required Fields' });
      return true; // If any attribute is empty, return true
    }
  }
  return false; // If all attributes are filled, return false
}

generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

}