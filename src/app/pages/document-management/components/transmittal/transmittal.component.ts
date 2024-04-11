import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transmittal',
  templateUrl: './transmittal.component.html',
  styleUrls: ['./transmittal.component.scss'],
})
export class TransmittalComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  openRegisterTransmittal() {
    this.router.navigate(['documents/register-transmittal']);
  } 
  
}
