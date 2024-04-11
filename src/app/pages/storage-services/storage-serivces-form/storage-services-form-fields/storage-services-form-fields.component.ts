import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ServiceConnectionTemplate } from 'src/app/core/models/service-connectioon-template.model';
import { StorageService } from 'src/app/core/models/storage-service.model';
import { StorageServicePropoerties } from 'src/app/core/models/storage-service.model-properites';
import { ApiService } from 'src/app/core/services/api.service';


interface ServiceType{
  param_name:string;
  param_value:string;
}

@Component({
  selector: 'app-storage-services-form-fields',
  templateUrl: './storage-services-form-fields.component.html',
  styleUrls: ['./storage-services-form-fields.component.scss']
})
export class StorageServicesFormFieldsComponent implements OnInit {
  @ViewChild('mtoForm') mtoForm: NgForm;
  @Input() storageService: StorageService;
  @Input()  storageProps:StorageServicePropoerties;
  @Input() storageServiceGroup;
  @Input() new: boolean;
  @Input() editing: boolean;
  newStorageservice:StorageService;

  serviceTypes: ServiceType[];
  templates:ServiceConnectionTemplate[];
  subscription = new Subscription();
  test:String;
  newFormGroup:FormGroup;
 

  constructor( private apiService: ApiService ,public fb:FormBuilder) {
      this.serviceTypes=[
        {  param_name:"Select Template" , param_value:"select template"},
        {  param_name:"AWS_S3",param_value:"AWS_S3"},
        {  param_name:"SHAREPOINT",param_value:"SHAREPOINT"},
      ];
   
   }

  ngOnInit(): void {
  }

  get getServiceTypes():FormArray{
    return this.storageServiceGroup.get("serviceTypes") as FormArray;
  }


  addServiceType(g:{}){
    let formGroup:FormGroup=this.fb.group(g)
    this.getServiceTypes.clear();
     this.getServiceTypes.push(formGroup)
  
  }

  onChange(e){
   let arrayGroup:{}
   if(e!=="select template"){
      
     this.subscription.add(this.apiService.query(ApiURL.service_connection_parameter_template + "?serviceType.equals=" + e).subscribe((serviceTemplates:ServiceConnectionTemplate[])=>{
       this.templates=serviceTemplates;
       
       serviceTemplates.forEach(s=>{
        arrayGroup=({...arrayGroup,[s.name]:['']})
      })
    
      this.addServiceType(arrayGroup)
     }
       ));
      console.log("Get serviceTypes>>>>>>>>>>>>>>>>>> " , this.getServiceTypes)
   }else{
    this.templates=null;
    // this.storageProps=new StorageServicePropoerties();
   }
    
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
