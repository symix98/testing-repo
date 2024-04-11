import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';


@Component({
  selector: 'app-form-track',
  templateUrl: './form-track.component.html',
  styleUrls: ['./form-track.component.scss']
})

export class FormTrackComponent implements OnInit {

  formData: any;
  dataid: String;
  formType: String;

  constructor(
    private router : Router, private activatedRouteService : ActivatedRoute,
    private apiService : ApiService, private utilitiesService : UtilitiesService,
  ) { }

  ngOnInit(): void {
    this.dataid = this.activatedRouteService.snapshot.paramMap.get('id');
    this.formType = this.activatedRouteService.snapshot.paramMap.get('formType');
  }

}
