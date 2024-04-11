import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ServiceConnectionTemplate } from 'src/app/core/models/service-connectioon-template.model';
import { StorageService } from 'src/app/core/models/storage-service.model';
import { StorageServicePropoerties } from 'src/app/core/models/storage-service.model-properites';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import {v4 as uuidv4} from 'uuid';
interface ServiceType{
  param_name:string;
  param_value:string;
}

@Component({
  selector: 'app-storage-services-form',
  templateUrl: './storage-services-form.component.html',
  styleUrls: ['./storage-services-form.component.scss']
})
export class StorageServicesFormComponent implements OnInit {
  subscription = new Subscription();
  new: boolean;
  editing: boolean=false;
  storageService:StorageService;
  storageProps:{id:Number,name:string,serviceType:string,dataType:string,value:string , 
    label:string,required:boolean , multiValue:boolean}[]
  storageServicePropoerties:StorageServicePropoerties
  serviceTypes: ServiceType[];
  templates:ServiceConnectionTemplate[];
  

  constructor(private activatedRouteService: ActivatedRoute , 
    private apiService: ApiService ,     private utilities: UtilitiesService 
    ,    private router: Router  , public fb:FormBuilder) { 
      this.serviceTypes=[
        {  param_name:"Select Template" , param_value:"select template"},
        {  param_name:"AWS_S3",param_value:"AWS_S3"},
        {  param_name:"SHAREPOINT",param_value:"SHAREPOINT"},
      ];
   
    this.subscription.add(this.activatedRouteService.paramMap.subscribe(val => {
       this.getStorageService();
    }))
    
  }

  ngOnInit(): void {}

  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
  onChange(e){
 
   this.storageProps=[];
   this.storageServicePropoerties=new StorageServicePropoerties();
    if(e!=="select template"){
      this.subscription.add(this.apiService.query(ApiURL.service_connection_parameter_template + "?serviceType.equals=" + e).subscribe((serviceTemplates:ServiceConnectionTemplate[])=>{
        this.templates=serviceTemplates;
        serviceTemplates.forEach(s=>{
         this.storageServicePropoerties[s.name]=""
          this.storageProps.push({id:s.id,name:s.name,
            value:"",
            serviceType:s.serviceType,
            dataType:s.dataType?.slice(1).toLowerCase(),
            label:s.label,
            required:s.valRequired,
            multiValue:s.multiValue
          })
       })}));
   
    }else{
     this.templates=null;
     this.storageProps=[]
     this.storageServicePropoerties=new StorageServicePropoerties()

    }  
   }

  getStorageService(){
    let serviceId = this.activatedRouteService.snapshot.paramMap.get("serviceId");
    if(serviceId){
      this.new=false;
      this.editing=true;
      this.subscription.add(
        this.apiService.query(ApiURL.storage_service + "?serviceId.equals=" + serviceId).subscribe(
          (storageService: StorageService) => {
            this.storageService = storageService;
            this.storageProps=[]
            this.storageServicePropoerties=new StorageServicePropoerties()
           
          }))
    }else {
      this.new = true;
      this.editing=false;
      this.storageService = new StorageService();
      this.storageProps=[]
      this.storageServicePropoerties=new StorageServicePropoerties()


    }
  
  }

  cancel(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.editing) {
        this.utilities.confirmDialog("Are you sure you want to cancel your changes?").then((confirm) => {
          if (confirm) {
            if (!this.new) {
              this.reloadPage()
            }
            else
              this.navigateToTable()
            resolve();
          } else {
            resolve();
          }
        })
      } else
        this.navigateToTable()
    })
  }


  reloadPage() {
    // this.edit()
    let serviceId = this.activatedRouteService.snapshot.paramMap.get("serviceId");
    const param =  { serviceId: serviceId } ;
    this.router.navigate(['services/create', param]);
  }

 
  navigateToTable() {
    this.router.navigate(['services'])
  }

  edit(){
    // console.log("Storage services " , this.storageService)
    // console.log("Storage services sorageProps " , this.storageProps)
  }

  save(){
    
// let myuuid = uuidv4();

// console.log('Your UUID is: ' + myuuid);
// console.log("is uuid ",this.isUUID(myuuid));
// console.log("is uuid test again ",this.isUUID("smjsdfjsd"));
// console.log("is uuid  again and again ",this.isUUID(myuuid+"1"));
     console.log("Storage services " , this.storageService)
    //  console.log("Storage services sorageProps " , this.storageProps)
     console.log(" this.storageServicePropoerties " , this.storageServicePropoerties)
  }

  isUUID= ( uuid:string  )=>{
    let pattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
   return pattern.test(uuid)

  }
}


