import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.scss']
})
export class AccessDeniedPageComponent implements OnInit {

  constructor(private utilties: UtilitiesService) { }

  ngOnInit(): void {
    this.logOut();
  }

  logOut() {
    setTimeout(async () => {
      await this.utilties.logOut();
    }, 15000)
  }
}