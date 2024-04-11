import { Component, OnInit } from '@angular/core';
declare const FormeoEditor: any;
declare const FormeoRenderer: any;

@Component({
  selector: 'app-form-engine',
  templateUrl: './form-engine.component.html',
  styleUrls: ['./form-engine.component.scss']
})
export class FormEngineComponent implements OnInit {
  form:any
  renderr:any
  options:any
  isEdit:boolean = true
  constructor() { }
  ngOnInit(): void {
    const defaults = {
      editorContainer:'.formeo-wrap',
      dataType: 'json',
      events: {},
      actions: {
        debug: true,
        // click : {
        //   btn : this.onSubmit('ee')
        // }
      },

    };
    this.options = defaults;
    this.form = new FormeoEditor(defaults)
    

  }
  onGen(){
    // console.log(this.form)
    this.isEdit = false
    this.renderr = new FormeoRenderer({renderContainer:'.render-form'});
    this.renderr.render(this.form.formData)
    this.renderr.renderedForm.onsubmit = this.getFormData
  }
  onSubmit(){
    console.log(this.renderr)
  }
  getFormData(e){
    console.log(e)
  }

}
