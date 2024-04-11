import {  Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { MtoLookupModel } from 'src/app/core/models/support-fab-models/mto-lookup.model';
import { SupportPictorial } from 'src/app/core/models/support-fab-models/support-pictorial.model';
import { SupportsModel } from 'src/app/core/models/support-fab-models/supports.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-supports-details-form',
  templateUrl: './supports-details-form.component.html',
  styleUrls: ['./supports-details-form.component.scss']
})
export class SupportsDetailsFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService : ApiService,
    private utilitiesService : UtilitiesService
  ) { }
  
  supportDetails:SupportsModel 
  picture :SupportPictorial
  isLoading:boolean = false
  isDisable :boolean = true
  show:boolean =false
  image:{h:string,w:string} = {h:'150',w:'200'};
  items: MenuItem[];
  activeIndex:number = 0
  @ViewChild('form', { read: NgForm }) form: any;
  ngOnInit(): void {
    let header = this.activatedRoute.snapshot.paramMap.get("id");
    this.apiService.get(ApiURL.support_headers + "/" + header).subscribe((res:MtoLookupModel) =>{
      this.supportDetails = res
      this.getRelatedPic(this.supportDetails.supportDetails.suppCat)
      // this.formChanges()
    })
    this.items = [
      {label: 'Items', icon: 'pi pi-fw pi-list'},
  ];
  }
  formChanges(){
    this.form.valueChanges.subscribe(changes => {
      console.log('Form changed:', changes);
    });
  }
  getRelatedPic(category){
    let query: ApiQuery = new ApiQuery()
    query.contains = new Map<any,any>([['type',category]])
    this.apiService.get(ApiURL.supports_pictorial_refs,query).subscribe((res:SupportPictorial[]) =>{
      if(res.length){
        if(res.length > 1){
          res.forEach(pic =>{
            if(pic.type.startsWith(category)){
              this.picture= pic
            }
          })
          if(!this.picture){
            this.picture = res[0]
          }
        }
        else{
          this.picture = res[0]
        }
        
      }
      
    })

  }

  submitForm(){
   this.apiService.put(ApiURL.support_headers + "/" + this.supportDetails.id,this.supportDetails).subscribe(res =>{
    this.utilitiesService.notifySuccess('Support Updated')
   },(err)=>{
    this.utilitiesService.notifyError(err.error.details)
    
   })
  }
  onEdit(){
    this.isDisable = !this.isDisable
  }

}
