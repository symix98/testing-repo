import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { SupportPictorial } from 'src/app/core/models/support-fab-models/support-pictorial.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-support-pictorial-form',
  templateUrl: './support-pictorial-form.component.html',
  styleUrls: ['./support-pictorial-form.component.scss']
})
export class SupportPictorialFormComponent implements OnInit {

  constructor(
    private utilitiesService: UtilitiesService,
    private ref : DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private apiService : ApiService
    
  ) { }
  isUpdate:boolean = false
  isLoading:boolean = false
  model: SupportPictorial;
  ngOnInit(): void {

    if(this.dynamicDialogConfig.data){
      console.log(this.dynamicDialogConfig.data)
      this.model = this.dynamicDialogConfig.data
      this.isUpdate = true
    }
    else{
      this.model = new SupportPictorial()
      this.isUpdate = false
    }
    
  }

  async submitForm() {
    this.isLoading = true
    // Handle form submission logic here
    let user = await this.utilitiesService.getCurrentAppUser()
    this.model.createdBy = user.name
    this.model.date = new Date()
    // console.log(this.model);
    if(this.isUpdate){
      this.apiService.put(ApiURL.supports_pictorial_refs + "/" + this.model.id,this.model).subscribe(res =>{

        
        this.utilitiesService.notifySuccess("Type Added Successfully");
        this.ref.close(true)
      },(err:any) =>{
        this.utilitiesService.notifyError(err.toString());
        this.isLoading = false
      })

    }else{
      this.apiService.post(ApiURL.supports_pictorial_refs,this.model).subscribe(res =>{

        
        this.utilitiesService.notifySuccess("Type Added Successfully");
        this.ref.close(true)
      },(err:any) =>{
        this.utilitiesService.notifyError(err.toString());
        this.isLoading = false

      })
      
    }
  }
  onUpload(e){
    console.log(e)
    let file: File = e.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      const imgStr: string = e.target.result.toString();
      this.model.picture = imgStr.split(",")[1];
      const { type, name } = file;
      this.model.pictureContentType = type;
  }
}
removeImage(){
  this.model.picture = null
  this.model.pictureContentType = null
}

}
